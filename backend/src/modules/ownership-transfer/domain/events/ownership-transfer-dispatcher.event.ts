import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UUID } from 'crypto'

export class OwnershipTransferDispatchedEvent implements DomainEvent {
  readonly occurredAt = new Date()

  constructor(
    public readonly fromResellerId: UUID,
    public readonly toResellerId: UUID,
    public readonly productId: UUID
  ) {}
}
