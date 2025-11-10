import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { UUID } from 'crypto'
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'

@Injectable()
export class ResetPasswordUseCase {
  constructor(
    @Inject('PasswordResetRequestRepository')
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly logger: CustomLogger
  ) {}

  async execute(token: string, newPassword: string): Promise<void> {
    const request = await this.passwordResetRequestRepository.findByToken(token)

    if (!request) {
      throw new NotFoundException('Invalid reset token')
    }

    if (request.status !== PasswordResetRequestStatus.APPROVED) {
      throw new BadRequestException(
        'Password reset request is not approved yet'
      )
    }

    const user = await this.userRepository.findById(request.userId as UUID)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const passwordHash = PasswordHash.generate(new Password(newPassword))
    user.passwordHash = passwordHash

    await this.userRepository.update(user)

    request.status = PasswordResetRequestStatus.COMPLETED
    request.completedAt = new Date()
    await this.passwordResetRequestRepository.update(request)

    this.logger.log(
      `Password reset completed for user ${user.email.getValue()}`,
      'ResetPasswordUseCase'
    )
  }
}
