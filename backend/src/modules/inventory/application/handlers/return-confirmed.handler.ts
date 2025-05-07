import { Inject, Injectable } from '@nestjs/common'
import { ReturnConfirmedEvent } from '@/modules/return/domain/events/return-confirmed.event'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
@Injectable()
export class ReturnConfirmedHandler {
  constructor(
    @Inject('InventoryService')
    private readonly inventoryService: IInventoryService,
    private readonly eventDispatcher: EventDispatcher,
    private readonly logger: CustomLogger
  ) {
    this.register()
  }

  register() {
    this.eventDispatcher.register(ReturnConfirmedEvent, this.handle.bind(this))
  }

  async handle(event: ReturnConfirmedEvent): Promise<void> {
    this.logger.warn(
      `Handling return confirmed event for return ${event.returnId}`,
      'ReturnConfirmedHandler'
    )
    await this.inventoryService.removeProductsFromReseller(
      event.resellerId,
      event.items,
      event.user
    )
  }
}
