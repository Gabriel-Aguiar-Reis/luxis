import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UUID } from 'crypto'

export interface ReturnRepository {
  create(returnEntity: Return): Promise<Return>
  findAll(): Promise<Return[]>
  findById(id: UUID): Promise<Return | null>
  findByResellerId(resellerId: UUID): Promise<Return[]>
  update(returnEntity: Return): Promise<Return>
  updateStatus(id: UUID, status: ReturnStatus): Promise<Return>
  delete(id: UUID): Promise<void>
}
