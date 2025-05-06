import { Inject, Injectable } from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'

@Injectable()
export class GetAllProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
    @Inject('InventoryService')
    private readonly inventoryService: IInventoryService
  ) {}

  async execute(user: UserPayload): Promise<Product[]> {
    if (user.role === Role.ADMIN || user.role === Role.ASSISTANT) {
      return await this.productRepo.findAll()
    }

    if (user.role === Role.RESELLER) {
      const inventory = await this.inventoryService.getInventory(user.id, user)
      if (!inventory) {
        return []
      }

      const allProducts = await this.productRepo.findAll()
      return allProducts.filter((product) =>
        inventory.products.includes(product.id)
      )
    }

    return await this.productRepo.findAll()
  }
}
