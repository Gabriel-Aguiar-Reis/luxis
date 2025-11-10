import { Inject, Injectable } from '@nestjs/common'
import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { PasswordResetRequestRepository } from '@/modules/auth/domain/repositories/password-reset-request.repository'

@Injectable()
export class ListPasswordResetRequestsUseCase {
  constructor(
    @Inject('PasswordResetRequestRepository')
    private readonly passwordResetRequestRepository: PasswordResetRequestRepository
  ) {}

  async execute(): Promise<PasswordResetRequest[]> {
    return this.passwordResetRequestRepository.findAll()
  }
}
