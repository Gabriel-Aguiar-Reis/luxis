import { UUID } from 'crypto'
import { DomainEvent } from '@/shared/events/domain-event.interface'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
export class ReturnConfirmedEvent implements DomainEvent {
  readonly occurredAt = new Date()

  constructor(
    public readonly returnId: UUID,
    public readonly resellerId: UUID,
    public readonly items: UUID[],
    public readonly user: UserPayload
  ) {}
}
