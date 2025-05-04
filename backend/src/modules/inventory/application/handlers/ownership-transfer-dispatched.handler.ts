import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { OwnershipTransferDispatchedEvent } from '@/modules/ownership-transfer/domain/events/ownership-transfer-dispatcher.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class OwnershipTransferDispatchedHandler {
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
      OwnershipTransferDispatchedEvent,
      this.handle.bind(this)
    )
  }

  async handle(event: OwnershipTransferDispatchedEvent) {
    this.logger.warn(
      `Handling ownership transfer dispatched event for product ${event.productId} from reseller ${event.fromResellerId} to reseller ${event.toResellerId}`,
      'OwnershipTransferDispatchedHandler'
    )
    await this.inventoryService.removeProductsFromReseller(
      event.fromResellerId,
      [event.productId],
      event.user
    )
    await this.inventoryService.addProductsToReseller(
      event.toResellerId,
      [event.productId],
      event.user
    )
  }
}
