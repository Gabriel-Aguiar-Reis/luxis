import { INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { UUID } from 'crypto'
import { AuthController } from '@/modules/auth/presentation/auth.controller'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { JwtStrategy } from '@/shared/infra/auth/jwt/jwt.strategy'
import { JwtAuthGuard } from '@/shared/infra/auth/guards/jwt-auth.guard'
import { PoliciesGuard } from '@/shared/infra/auth/guards/policies.guard'
import { RequestPasswordResetUseCase } from '@/modules/auth/application/use-cases/request-password-reset.use-case'
import { ListPasswordResetRequestsUseCase } from '@/modules/auth/application/use-cases/list-password-reset-requests.use-case'
import { ApprovePasswordResetRequestUseCase } from '@/modules/auth/application/use-cases/approve-password-reset-request.use-case'
import { RejectPasswordResetRequestUseCase } from '@/modules/auth/application/use-cases/reject-password-reset-request.use-case'
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { User } from '@/modules/user/domain/entities/user.entity'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { Email } from '@/shared/common/value-object/email.vo'

const AUTH_COOKIE_NAME = 'luxis_auth_token'

class InMemoryUserRepository extends UserRepository {
  private readonly users = new Map<UUID, User>()

  async findAll(): Promise<User[]> {
    return Array.from(this.users.values())
  }

  async findAllPending(): Promise<User[]> {
    return Array.from(this.users.values()).filter(
      (user) => user.status === UserStatus.PENDING
    )
  }

  async findById(id: UUID): Promise<User | null> {
    return this.users.get(id) ?? null
  }

  async findByEmail(email: Email): Promise<User | null> {
    return (
      Array.from(this.users.values()).find(
        (user) => user.email.getValue() === email.getValue()
      ) ?? null
    )
  }

  async create(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async update(user: User): Promise<User> {
    this.users.set(user.id, user)
    return user
  }

  async updateRole(id: UUID, role: Role, status?: UserStatus): Promise<User> {
    const user = await this.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    user.role = role

    if (status) {
      user.status = status
    }

    this.users.set(id, user)
    return user
  }

  async updateStatus(id: UUID, status: UserStatus): Promise<User> {
    const user = await this.findById(id)

    if (!user) {
      throw new Error('User not found')
    }

    user.status = status
    this.users.set(id, user)
    return user
  }

  async delete(id: UUID): Promise<void> {
    this.users.delete(id)
  }

  async disable(id: UUID): Promise<User> {
    return this.updateStatus(id, UserStatus.DISABLED)
  }

  async findManyByIds(ids: UUID[]): Promise<User[]> {
    return ids
      .map((id) => this.users.get(id) ?? null)
      .filter((user): user is User => user !== null)
  }

  clear() {
    this.users.clear()
  }
}

describe('Auth cookie flow (integration)', () => {
  let app: INestApplication
  let userRepository: InMemoryUserRepository

  beforeAll(async () => {
    process.env.NODE_ENV = 'test'
    process.env.JWT_SECRET = 'test-jwt-secret'
    process.env.JWT_EXPIRATION_TIME = '1d'
    process.env.AUTH_COOKIE_NAME = AUTH_COOKIE_NAME

    const loggerMock = {
      log: jest.fn(),
      error: jest.fn(),
      warn: jest.fn(),
      debug: jest.fn(),
      verbose: jest.fn()
    }

    const moduleRef = await Test.createTestingModule({
      imports: [
        NestConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true
        }),
        PassportModule,
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: process.env.JWT_EXPIRATION_TIME as any }
        })
      ],
      controllers: [AuthController],
      providers: [
        AppConfigService,
        AuthService,
        JwtStrategy,
        JwtAuthGuard,
        PoliciesGuard,
        Reflector,
        { provide: CustomLogger, useValue: loggerMock },
        {
          provide: 'CaslAbilityFactory',
          useValue: { createForUser: () => ({ can: () => true }) }
        },
        { provide: 'UserRepository', useClass: InMemoryUserRepository },
        {
          provide: 'EmailService',
          useValue: { sendResetPasswordLink: jest.fn() }
        },
        {
          provide: RequestPasswordResetUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: ListPasswordResetRequestsUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: ApprovePasswordResetRequestUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: RejectPasswordResetRequestUseCase,
          useValue: { execute: jest.fn() }
        },
        {
          provide: ResetPasswordUseCase,
          useValue: { execute: jest.fn() }
        }
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    userRepository = moduleRef.get<InMemoryUserRepository>('UserRepository')
  }, 15000)

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  beforeEach(() => {
    userRepository.clear()
  })

  async function seedActiveAdmin(password: string) {
    await userRepository.create(
      new User(
        '11111111-1111-4111-8111-111111111111',
        new Name('Auth'),
        new Name('Admin'),
        new PhoneNumber('12912345678'),
        new Email('auth.admin@luxis.com'),
        PasswordHash.generate(new Password(password)),
        Role.ADMIN,
        new Residence(
          new Address(
            'Main St',
            123,
            'Center',
            'Sao Paulo',
            FederativeUnit.SP,
            new PostalCode('12345678'),
            Country.BRAZIL
          )
        ),
        UserStatus.ACTIVE
      )
    )
  }

  it('returns 204 and sets an httpOnly auth cookie on login', async () => {
    await seedActiveAdmin('Password123!')

    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'Password123!'
      })

    expect(response.status).toBe(204)
    expect(response.body).toEqual({})
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining(`${AUTH_COOKIE_NAME}=`)])
    )
    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining('HttpOnly')])
    )
  })

  it('verifies the session using only the auth cookie', async () => {
    await seedActiveAdmin('Password123!')

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'Password123!'
      })

    const cookie = loginResponse.headers['set-cookie'][0]

    const verifyResponse = await request(app.getHttpServer())
      .post('/auth/verify')
      .set('Cookie', cookie)

    expect(verifyResponse.status).toBe(200)
    expect(verifyResponse.body.valid).toBe(true)
    expect(verifyResponse.body.user).toMatchObject({
      email: 'auth.admin@luxis.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      name: 'Auth Admin'
    })
  })

  it('clears the auth cookie on logout and invalidates verify', async () => {
    await seedActiveAdmin('Password123!')

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'Password123!'
      })

    const cookie = loginResponse.headers['set-cookie'][0]

    const logoutResponse = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Cookie', cookie)

    expect(logoutResponse.status).toBe(204)
    expect(logoutResponse.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining(`${AUTH_COOKIE_NAME}=;`)])
    )

    const verifyAfterLogoutResponse = await request(app.getHttpServer())
      .post('/auth/verify')
      .set('Cookie', `${AUTH_COOKIE_NAME}=`)

    expect(verifyAfterLogoutResponse.status).toBe(401)
  })

  it('changes password based on the authenticated user from the cookie', async () => {
    await seedActiveAdmin('Password123!')

    const loginResponse = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'Password123!'
      })

    const cookie = loginResponse.headers['set-cookie'][0]

    const changePasswordResponse = await request(app.getHttpServer())
      .post('/auth/change-password')
      .set('Cookie', cookie)
      .send({
        newPassword: 'NewPassword123!'
      })

    expect(changePasswordResponse.status).toBe(204)

    const oldPasswordLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'Password123!'
      })

    expect(oldPasswordLogin.status).toBe(401)

    const newPasswordLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'auth.admin@luxis.com',
        password: 'NewPassword123!'
      })

    expect(newPasswordLogin.status).toBe(204)
    expect(newPasswordLogin.headers['set-cookie']).toEqual(
      expect.arrayContaining([expect.stringContaining(`${AUTH_COOKIE_NAME}=`)])
    )
  })
})
