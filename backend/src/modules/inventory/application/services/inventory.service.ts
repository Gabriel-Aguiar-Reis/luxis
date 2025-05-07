import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryRepository } from '@/modules/inventory/domain/repositories/inventory.repository'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class InventoryService implements IInventoryService {
  constructor(
    @Inject('InventoryRepository')
    private readonly inventoryRepository: InventoryRepository,
    private readonly logger: CustomLogger
  ) {}

  async addProductsToReseller(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ) {
    this.logger.warn(
      `Adding products to reseller ${resellerId} - Requested by user ${user.email}`,
      'InventoryService'
    )
    let inventory = await this.inventoryRepository.findByResellerId(resellerId)

    if (!inventory) {
      inventory = new Inventory(resellerId)
    }

    for (const id of productIds) {
      inventory.addProduct(id)
    }

    await this.inventoryRepository.save(inventory)
  }

  async removeProductsFromReseller(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ) {
    this.logger.warn(
      `Removing products from reseller ${resellerId} - Requested by user ${user.email}`,
      'InventoryService'
    )
    const inventory =
      await this.inventoryRepository.findByResellerId(resellerId)

    if (!inventory) {
      this.logger.warn(
        `Inventory not found for reseller ${resellerId}`,
        'InventoryService'
      )
      return
    }

    for (const id of productIds) {
      inventory.removeProduct(id)
    }

    await this.inventoryRepository.save(inventory)
  }

  async getInventory(
    resellerId: UUID,
    user: UserPayload
  ): Promise<Inventory | null> {
    this.logger.log(
      `Getting inventory for reseller ${resellerId} - Requested by user ${user.email}`,
      'InventoryService'
    )
    return this.inventoryRepository.findByResellerId(resellerId)
  }
}
