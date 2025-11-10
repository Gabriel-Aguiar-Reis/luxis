import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'

export interface PasswordResetRequestRepository {
  create(request: PasswordResetRequest): Promise<PasswordResetRequest>
  findById(id: string): Promise<PasswordResetRequest | null>
  findByToken(token: string): Promise<PasswordResetRequest | null>
  findAll(): Promise<PasswordResetRequest[]>
  findByStatus(
    status: PasswordResetRequestStatus
  ): Promise<PasswordResetRequest[]>
  update(request: PasswordResetRequest): Promise<PasswordResetRequest>
  delete(id: string): Promise<void>
}
