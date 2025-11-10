import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { randomUUID } from 'crypto'
import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Email } from '@/shared/common/value-object/email.vo'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

/**
 * Password Reset Request Use Case (Manual Approval Flow)
 *
 * This use case creates a password reset request that requires manual admin approval.
 *
 * Flow:
 * 1. User submits email via forgot-password form
 * 2. This use case creates a PasswordResetRequest with status PENDING
 * 3. A unique token is generated for the request
 * 4. Admin reviews pending requests in the admin panel
 * 5. Admin can approve or reject the request
 * 6. If approved, admin manually shares the reset link containing the token
 * 7. User uses the link to reset password (validated by ResetPasswordUseCase)
 *
 * NOTE: No emails are sent automatically. The admin must manually provide
 * the reset link to the user through a secure channel.
 */
@Injectable()
export class RequestPasswordResetUseCase {
  constructor(
    @Inject('PasswordResetRequestRepository')
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    private readonly logger: CustomLogger
  ) {}

  async execute(email: string): Promise<PasswordResetRequest> {
    const emailVo = new Email(email)
    const user = await this.userRepository.findByEmail(emailVo)

    if (!user) {
      throw new NotFoundException('User not found')
    }

    const token = randomUUID()

    function getFullName(user?: {
      name: { getValue(): string }
      surname: { getValue(): string }
    }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    const request = new PasswordResetRequest()
    request.userId = user.id
    request.username = getFullName(user)
    request.email = user.email
    request.phone = user.phone
    request.token = token

    const saved = await this.passwordResetRequestRepository.create(request)

    this.logger.log(
      `Password reset request created for user ${user.email.getValue()}`,
      'RequestPasswordResetUseCase'
    )

    return saved
  }
}
