import { Injectable, ForbiddenException } from '@nestjs/common'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { UUID } from 'crypto'
import { InventoryOwnershipVerifier } from '@/modules/sale/domain/services/inventory-ownership-verify.interface'

@Injectable()
export class InventoryOwnershipVerifierService
  implements InventoryOwnershipVerifier
{
  constructor(private readonly inventoryService: InventoryService) {}

  async verifyOwnership(resellerId: UUID, productIds: UUID[]): Promise<void> {
    const inventory = await this.inventoryService.getInventory(resellerId)

    if (!inventory) {
      throw new ForbiddenException('Inventory not found')
    }

    const unauthorizedProduct = productIds.find(
      (id) => !inventory.hasProduct(id)
    )

    if (unauthorizedProduct) {
      throw new ForbiddenException(
        `Product ${unauthorizedProduct} is not in your inventory`
      )
    }
  }
}
