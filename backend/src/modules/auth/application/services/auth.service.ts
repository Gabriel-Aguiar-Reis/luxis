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
import { LoginDto } from '@/modules/auth/application/dtos/login.dto'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Email } from '@/shared/common/value-object/email.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { EmailService } from '@/modules/auth/application/services/email.service'
import { VerifyDto } from '@/modules/auth/application/dtos/verify.dto'
import { UUID } from 'crypto'
import { ChangePasswordDto } from '@/modules/auth/application/dtos/change-password.dto'

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

  async changePassword(dto: ChangePasswordDto): Promise<void> {
    const user = await this.userRepository.findById(dto.userId)
    if (!user) {
      this.logger.error(
        `User not found for change password: ${dto.userId}`,
        'AuthService'
      )
      throw new NotFoundException('User not found')
    }

    const password = new Password(dto.newPassword)
    const passwordHash = PasswordHash.generate(password)
    user.passwordHash = passwordHash
    await this.userRepository.update(user)

    this.logger.log(
      `Password changed successfully for user: ${user.email.getValue()}`,
      'AuthService'
    )
  }

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

  /**
   * @deprecated This method is no longer used. Password reset now uses manual approval flow.
   * See RequestPasswordResetUseCase for the current implementation.
   */
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

    // NOTE: Email sending removed - password reset now requires manual admin approval
    // await this.emailService.sendResetPasswordLink(email)
    this.logger.log(
      `Password reset request created for ${email.getValue()} - awaiting admin approval`,
      'AuthService'
    )
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

  async verifyToken(token: string): Promise<VerifyDto> {
    try {
      const payload = this.jwtService.verify(token)
      const user = await this.userRepository.findById(payload.sub)
      if (!user) {
        throw new NotFoundException('User not found')
      }

      if (user.status !== UserStatus.ACTIVE) {
        throw new UnauthorizedException('User is inactive')
      }

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email.getValue(),
          role: user.role,
          status: user.status,
          name: `${user.name.getValue()} ${user.surname.getValue()}`
        }
      }
    } catch (error) {
      this.logger.error(
        `Token verification failed: ${error.message}`,
        'AuthService'
      )
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
