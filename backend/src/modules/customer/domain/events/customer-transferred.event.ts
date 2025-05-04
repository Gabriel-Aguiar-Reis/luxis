import { UUID } from 'crypto'
import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
export class CustomerTransferredEvent implements DomainEvent {
  constructor(
    public readonly customerId: UUID,
    public readonly fromResellerId: UUID,
    public readonly toResellerId: UUID,
    public readonly user: UserPayload,
    public readonly occurredAt: Date = new Date()
  ) {}
}
