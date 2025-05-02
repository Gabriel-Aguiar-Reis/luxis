import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'

export abstract class OwnershipTransferRepository {
  abstract findAll(): Promise<OwnershipTransfer[]>
  abstract findAllByResellerId(resellerId: UUID): Promise<OwnershipTransfer[]>
  abstract findById(id: UUID): Promise<OwnershipTransfer | null>
  abstract create(
    ownershipTransfer: OwnershipTransfer
  ): Promise<OwnershipTransfer>
  abstract update(
    ownershipTransfer: OwnershipTransfer
  ): Promise<OwnershipTransfer>
  abstract updateStatus(
    id: UUID,
    status: OwnershipTransferStatus
  ): Promise<OwnershipTransfer>
  abstract delete(id: UUID): Promise<void>
}
