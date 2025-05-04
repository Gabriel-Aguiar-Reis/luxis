import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { ShipmentDispatchedEvent } from '@/modules/shipment/domain/events/shipment-dispatcher.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class ShipmentDispatchedHandler {
  constructor(
    @Inject('InventoryService')
    private readonly inventoryService: InventoryService,
    private readonly eventDispatcher: EventDispatcher
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(
      ShipmentDispatchedEvent,
      this.handle.bind(this)
    )
  }

  async handle(event: ShipmentDispatchedEvent) {
    await this.inventoryService.addProductsToReseller(
      event.resellerId,
      event.productIds
    )
  }
}
