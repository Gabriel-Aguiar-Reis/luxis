import { UUID } from 'crypto'
import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
export class CustomerDeletedEvent implements DomainEvent {
  constructor(
    public readonly customerId: UUID,
    public readonly resellerId: UUID,
    public readonly user: UserPayload,
    public readonly occurredAt: Date = new Date()
  ) {}
}
