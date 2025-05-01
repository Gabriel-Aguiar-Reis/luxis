import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryRepository } from '@/modules/inventory/domain/repositories/inventory.repository'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { Injectable } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class InventoryService implements IInventoryService {
  constructor(private readonly inventoryRepository: InventoryRepository) {}

  async addProductsToReseller(resellerId: UUID, productIds: UUID[]) {
    let inventory = await this.inventoryRepository.findByResellerId(resellerId)

    if (!inventory) {
      inventory = new Inventory(resellerId)
    }

    for (const id of productIds) {
      inventory.addProduct(id)
    }

    await this.inventoryRepository.save(inventory)
  }

  async removeProductsFromReseller(resellerId: UUID, productIds: UUID[]) {
    const inventory =
      await this.inventoryRepository.findByResellerId(resellerId)
    if (!inventory) return

    for (const id of productIds) {
      inventory.removeProduct(id)
    }

    await this.inventoryRepository.save(inventory)
  }

  async getInventory(resellerId: UUID): Promise<Inventory | null> {
    return this.inventoryRepository.findByResellerId(resellerId)
  }
}
