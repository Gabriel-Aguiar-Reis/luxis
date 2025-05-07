import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

export class OwnershipTransferDispatchedEvent implements DomainEvent {
  readonly occurredAt = new Date()

  constructor(
    public readonly fromResellerId: UUID,
    public readonly toResellerId: UUID,
    public readonly productId: UUID,
    public readonly user: UserPayload
  ) {}
}
