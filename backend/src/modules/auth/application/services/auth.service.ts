import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { LoginDto } from '@/modules/auth/presentation/dtos/login.dto'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const user = await this.userRepository.findByEmail(dto.email)

    if (!user) {
      this.logger.error(
        `Invalid credentials - Email: ${dto.email.getValue()}`,
        'AuthService'
      )
      throw new UnauthorizedException('Invalid credentials')
    }

    const dtoPassword = new PasswordHash(dto.password.getValue())

    const isPasswordValid =
      dtoPassword.getValue() === user.passwordHash.getValue()

    if (!isPasswordValid) {
      this.logger.error(
        `Invalid credentials - Email: ${dto.email.getValue()}`,
        'AuthService'
      )
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.error(
        `User is inactive - Email: ${dto.email.getValue()}`,
        'AuthService'
      )
      throw new UnauthorizedException('User is inactive')
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role,
      status: user.status
    }

    return {
      accessToken: this.jwtService.sign(payload)
    }
  }
}
