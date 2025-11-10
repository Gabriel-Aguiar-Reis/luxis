import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

@Injectable()
export class RejectPasswordResetRequestUseCase {
  constructor(
    @Inject('PasswordResetRequestRepository')
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository,
    private readonly logger: CustomLogger
  ) {}

  async execute(id: string): Promise<void> {
    const request = await this.passwordResetRequestRepository.findById(id)

    if (!request) {
      throw new NotFoundException('Password reset request not found')
    }

    request.status = PasswordResetRequestStatus.REJECTED
    request.rejectedAt = new Date()

    await this.passwordResetRequestRepository.update(request)

    this.logger.log(
      `Password reset request ${id} rejected`,
      'RejectPasswordResetRequestUseCase'
    )
  }
}
