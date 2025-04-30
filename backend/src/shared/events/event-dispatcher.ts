import { DomainEvent } from '@/shared/events/domain-event.interface'

type EventHandler<T extends DomainEvent> = (event: T) => Promise<void> | void

export class EventDispatcher {
  private handlers = new Map<string, EventHandler<any>[]>()

  register<T extends DomainEvent>(
    eventClass: new (...args: any[]) => T,
    handler: EventHandler<T>
  ) {
    const key = eventClass.name
    const existing = this.handlers.get(key) ?? []
    this.handlers.set(key, [...existing, handler])
  }

  async dispatch<T extends DomainEvent>(event: T) {
    const handlers = this.handlers.get(event.constructor.name) ?? []
    for (const handler of handlers) {
      await handler(event)
    }
  }
}
