import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UUID } from 'crypto'

export class ShipmentDispatchedEvent implements DomainEvent {
  readonly occurredAt = new Date()

  constructor(
    public readonly shipmentId: UUID,
    public readonly resellerId: UUID,
    public readonly productIds: UUID[]
  ) {}
}
