import { Injectable, ForbiddenException, Inject } from '@nestjs/common'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { UUID } from 'crypto'
import { IInventoryOwnershipVerifier } from '@/modules/sale/domain/services/inventory-ownership-verify.interface'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

@Injectable()
export class InventoryOwnershipVerifierService
  implements IInventoryOwnershipVerifier
{
  constructor(
    @Inject('InventoryService')
    private readonly inventoryService: InventoryService
  ) {}

  async verifyOwnership(
    resellerId: UUID,
    productIds: UUID[],
    user: UserPayload
  ): Promise<void> {
    const inventory = await this.inventoryService.getInventory(resellerId, user)
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
