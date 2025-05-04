import { Inject, Injectable } from '@nestjs/common'
import { ReturnConfirmedEvent } from '@/modules/return/domain/events/return-confirmed.event'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'

@Injectable()
export class ReturnConfirmedHandler {
  constructor(
    @Inject('InventoryService')
    private readonly inventoryService: InventoryService,
    private readonly eventDispatcher: EventDispatcher
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(ReturnConfirmedEvent, this.handle.bind(this))
  }

  async handle(event: ReturnConfirmedEvent): Promise<void> {
    await this.inventoryService.removeProductsFromReseller(
      event.resellerId,
      event.items
    )
  }
}
