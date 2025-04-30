import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { OwnershipTransferDispatchedEvent } from '@/modules/ownership-transfer/domain/events/ownership-transfer-dispatcher.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { Injectable } from '@nestjs/common'

@Injectable()
export class OwnershipTransferDispatchedHandler {
  constructor(
    private readonly inventoryService: InventoryService,
    private readonly eventDispatcher: EventDispatcher
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(
      OwnershipTransferDispatchedEvent,
      this.handle.bind(this)
    )
  }

  async handle(event: OwnershipTransferDispatchedEvent) {
    await this.inventoryService.removeProductsFromReseller(
      event.fromResellerId,
      [event.productId]
    )
    await this.inventoryService.addProductsToReseller(event.toResellerId, [
      event.productId
    ])
  }
}
