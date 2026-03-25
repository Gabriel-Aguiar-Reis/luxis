import { INestApplication } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { Test } from '@nestjs/testing'
import * as request from 'supertest'
import { randomUUID, UUID } from 'crypto'
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
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'
import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
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

class InMemoryPasswordResetRequestRepository
  implements PasswordResetRequestRepository
{
  private readonly requests = new Map<string, PasswordResetRequest>()

  async create(request: PasswordResetRequest): Promise<PasswordResetRequest> {
    request.id = (request.id ?? randomUUID()) as UUID
    request.status = request.status ?? PasswordResetRequestStatus.PENDING
    request.createdAt = request.createdAt ?? new Date()
    this.requests.set(request.id, request)
    return request
  }

  async findById(id: string): Promise<PasswordResetRequest | null> {
    return this.requests.get(id) ?? null
  }

  async findByToken(token: string): Promise<PasswordResetRequest | null> {
    return (
      Array.from(this.requests.values()).find(
        (request) => request.token === token
      ) ?? null
    )
  }

  async findAll(): Promise<PasswordResetRequest[]> {
    return Array.from(this.requests.values())
  }

  async findByStatus(
    status: PasswordResetRequestStatus
  ): Promise<PasswordResetRequest[]> {
    return Array.from(this.requests.values()).filter(
      (request) => request.status === status
    )
  }

  async update(request: PasswordResetRequest): Promise<PasswordResetRequest> {
    this.requests.set(request.id, request)
    return request
  }

  async delete(id: string): Promise<void> {
    this.requests.delete(id)
  }

  clear() {
    this.requests.clear()
  }
}

describe('Password reset flow (integration)', () => {
  let app: INestApplication
  let userRepository: InMemoryUserRepository
  let passwordResetRepository: InMemoryPasswordResetRequestRepository

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
        RequestPasswordResetUseCase,
        ListPasswordResetRequestsUseCase,
        ApprovePasswordResetRequestUseCase,
        RejectPasswordResetRequestUseCase,
        ResetPasswordUseCase,
        { provide: CustomLogger, useValue: loggerMock },
        {
          provide: 'CaslAbilityFactory',
          useValue: { createForUser: () => ({ can: () => true }) }
        },
        { provide: 'UserRepository', useClass: InMemoryUserRepository },
        {
          provide: 'PasswordResetRequestRepository',
          useClass: InMemoryPasswordResetRequestRepository
        },
        {
          provide: 'EmailService',
          useValue: { sendResetPasswordLink: jest.fn() }
        }
      ]
    }).compile()

    app = moduleRef.createNestApplication()
    await app.init()

    userRepository = moduleRef.get<InMemoryUserRepository>('UserRepository')
    passwordResetRepository =
      moduleRef.get<InMemoryPasswordResetRequestRepository>(
        'PasswordResetRequestRepository'
      )
  }, 15000)

  afterAll(async () => {
    if (app) {
      await app.close()
    }
  })

  beforeEach(() => {
    userRepository.clear()
    passwordResetRepository.clear()
  })

  async function seedUser(params: {
    id: UUID
    name: string
    surname: string
    email: string
    password: string
    role: Role
  }) {
    await userRepository.create(
      new User(
        params.id,
        new Name(params.name),
        new Name(params.surname),
        new PhoneNumber('12912345678'),
        new Email(params.email),
        PasswordHash.generate(new Password(params.password)),
        params.role,
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

  async function loginAndGetCookie(email: string, password: string) {
    const response = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email,
        password
      })

    expect(response.status).toBe(204)
    return response.headers['set-cookie'][0]
  }

  it('creates a pending password reset request for an existing user', async () => {
    await seedUser({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Reseller',
      surname: 'User',
      email: 'reseller.user@luxis.com',
      password: 'Password123!',
      role: Role.RESELLER
    })

    const response = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'reseller.user@luxis.com' })

    expect(response.status).toBe(201)
    expect(response.body.status).toBe('PENDING')
    expect(response.body.token).toEqual(expect.any(String))

    const storedRequests = await passwordResetRepository.findAll()
    expect(storedRequests).toHaveLength(1)
    expect(storedRequests[0].status).toBe(PasswordResetRequestStatus.PENDING)
  })

  it('allows an admin to list, approve and complete a password reset request', async () => {
    await seedUser({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Admin',
      surname: 'User',
      email: 'admin.user@luxis.com',
      password: 'Password123!',
      role: Role.ADMIN
    })
    await seedUser({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Reseller',
      surname: 'User',
      email: 'reseller.user@luxis.com',
      password: 'Password123!',
      role: Role.RESELLER
    })

    const requestResponse = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'reseller.user@luxis.com' })

    expect(requestResponse.status).toBe(201)
    const resetRequestId = requestResponse.body.id as string
    const resetToken = requestResponse.body.token as string

    const adminCookie = await loginAndGetCookie(
      'admin.user@luxis.com',
      'Password123!'
    )

    const listResponse = await request(app.getHttpServer())
      .get('/auth/password-reset-requests')
      .set('Cookie', adminCookie)

    expect(listResponse.status).toBe(200)
    expect(listResponse.body).toHaveLength(1)
    expect(listResponse.body[0]).toMatchObject({
      id: resetRequestId,
      status: 'PENDING'
    })

    const approveResponse = await request(app.getHttpServer())
      .patch(`/auth/password-reset-requests/${resetRequestId}/approve`)
      .set('Cookie', adminCookie)

    expect(approveResponse.status).toBe(204)

    const resetResponse = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        token: resetToken,
        newPassword: 'NewPassword123!'
      })

    expect(resetResponse.status).toBe(204)

    const oldPasswordLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'reseller.user@luxis.com',
        password: 'Password123!'
      })
    expect(oldPasswordLogin.status).toBe(401)

    const newPasswordLogin = await request(app.getHttpServer())
      .post('/auth/login')
      .send({
        email: 'reseller.user@luxis.com',
        password: 'NewPassword123!'
      })
    expect(newPasswordLogin.status).toBe(204)

    const storedRequest = await passwordResetRepository.findById(resetRequestId)
    expect(storedRequest?.status).toBe(PasswordResetRequestStatus.COMPLETED)
    expect(storedRequest?.approvedAt).toBeInstanceOf(Date)
    expect(storedRequest?.completedAt).toBeInstanceOf(Date)
  })

  it('rejects reset completion when the request has been rejected by an admin', async () => {
    await seedUser({
      id: '11111111-1111-4111-8111-111111111111',
      name: 'Admin',
      surname: 'User',
      email: 'admin.user@luxis.com',
      password: 'Password123!',
      role: Role.ADMIN
    })
    await seedUser({
      id: '22222222-2222-4222-8222-222222222222',
      name: 'Reseller',
      surname: 'User',
      email: 'reseller.user@luxis.com',
      password: 'Password123!',
      role: Role.RESELLER
    })

    const requestResponse = await request(app.getHttpServer())
      .post('/auth/forgot-password')
      .send({ email: 'reseller.user@luxis.com' })

    const resetRequestId = requestResponse.body.id as string
    const resetToken = requestResponse.body.token as string
    const adminCookie = await loginAndGetCookie(
      'admin.user@luxis.com',
      'Password123!'
    )

    const rejectResponse = await request(app.getHttpServer())
      .patch(`/auth/password-reset-requests/${resetRequestId}/reject`)
      .set('Cookie', adminCookie)

    expect(rejectResponse.status).toBe(204)

    const resetResponse = await request(app.getHttpServer())
      .post('/auth/reset-password')
      .send({
        token: resetToken,
        newPassword: 'NewPassword123!'
      })

    expect(resetResponse.status).toBe(400)
    expect(resetResponse.body.message).toBe(
      'Password reset request is not approved yet'
    )

    const storedRequest = await passwordResetRepository.findById(resetRequestId)
    expect(storedRequest?.status).toBe(PasswordResetRequestStatus.REJECTED)
    expect(storedRequest?.rejectedAt).toBeInstanceOf(Date)
  })
})
