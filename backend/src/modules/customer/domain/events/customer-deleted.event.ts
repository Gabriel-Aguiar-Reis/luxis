import { UUID } from 'crypto'
import { DomainEvent } from '@/shared/events/domain-event.interface'

export class CustomerDeletedEvent implements DomainEvent {
  constructor(
    public readonly customerId: UUID,
    public readonly resellerId: UUID,
    public readonly occurredAt: Date = new Date()
  ) {}
}
