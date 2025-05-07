import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { ShipmentDispatchedEvent } from '@/modules/shipment/domain/events/shipment-dispatcher.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class ShipmentDispatchedHandler {
  constructor(
    @Inject('InventoryService')
    private readonly inventoryService: IInventoryService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: CustomLogger
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
    this.logger.warn(
      `Handling shipment dispatched event for shipment ${event.shipmentId}`,
      'ShipmentDispatchedHandler'
    )
    await this.inventoryService.addProductsToReseller(
      event.resellerId,
      event.productIds,
      event.user
    )
  }
}
