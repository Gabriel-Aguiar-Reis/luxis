import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  BadRequestException
} from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { LoginDto } from '@/modules/auth/presentation/dtos/login.dto'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Email } from '@/shared/common/value-object/email.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { InjectPinoLogger } from 'nestjs-pino'
import { EmailService } from '@/modules/auth/application/services/email.service'

@Injectable()
export class AuthService {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly logger: CustomLogger,
    @Inject('EmailService')
    private readonly emailService: EmailService
  ) {}

  async login(dto: LoginDto): Promise<{ accessToken: string }> {
    const email = new Email(dto.email)
    const user = await this.userRepository.findByEmail(email)

    if (!user) {
      this.logger.error(
        `Invalid credentials - Email: ${email.getValue()}`,
        'AuthService'
      )
      throw new UnauthorizedException('Invalid credentials')
    }
    const password = new Password(dto.password)
    const dtoPassword = PasswordHash.generate(password)
    const isPasswordValid =
      dtoPassword.getValue() === user.passwordHash.getValue()

    if (!isPasswordValid) {
      this.logger.error(
        `Invalid credentials - Email: ${email.getValue()}`,
        'AuthService'
      )
      throw new UnauthorizedException('Invalid credentials')
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.error(
        `User is inactive - Email: ${email.getValue()}`,
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

  async forgotPassword(email: Email): Promise<void> {
    const user = await this.userRepository.findByEmail(email)
    if (!user) {
      this.logger.error(
        `Attempt to reset password for non-existent email: ${email.getValue()}`,
        'AuthService'
      )
      return // We don't reveal if the email exists or not for security reasons
    }

    if (user.status !== UserStatus.ACTIVE) {
      this.logger.error(
        `Attempt to reset password for inactive user: ${email.getValue()}`,
        'AuthService'
      )
      return
    }

    await this.emailService.sendResetPasswordLink(email)
  }

  async resetPassword(token: string, newPassword: string): Promise<void> {
    try {
      const payload = this.jwtService.verify(token)

      if (payload.type !== 'password_reset') {
        throw new BadRequestException('Invalid token')
      }

      const user = await this.userRepository.findById(payload.sub)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      const password = new Password(newPassword)
      const passwordHash = PasswordHash.generate(password)

      user.passwordHash = passwordHash
      await this.userRepository.update(user)

      this.logger.log(
        `Password reset successful for user: ${user.email.getValue()}`,
        'AuthService'
      )
    } catch (error) {
      this.logger.error(
        `Error resetting password: ${error.message}`,
        'AuthService'
      )
      throw new BadRequestException('Invalid or expired token')
    }
  }
}
