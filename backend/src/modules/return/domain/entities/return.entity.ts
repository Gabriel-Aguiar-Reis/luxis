import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { UUID } from 'crypto'

export class Return {
  constructor(
    public readonly id: UUID,
    public readonly resellerId: UUID,
    public readonly items: UUID[],
    public readonly status: ReturnStatus,
    public readonly createdAt: Date
  ) {}
}
