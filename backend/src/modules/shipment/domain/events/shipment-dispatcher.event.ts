import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
export class ShipmentDispatchedEvent implements DomainEvent {
  readonly occurredAt = new Date()

  constructor(
    public readonly shipmentId: UUID,
    public readonly resellerId: UUID,
    public readonly productIds: UUID[],
    public readonly user: UserPayload
  ) {}
}
