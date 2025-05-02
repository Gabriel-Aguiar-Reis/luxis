import {
  Inject,
  Injectable,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'

import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UUID } from 'crypto'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetOneProductUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepo: ProductRepository,
    @Inject('InventoryService')
    private readonly inventoryService: IInventoryService
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<Product> {
    const product = await this.productRepo.findById(id)
    if (!product) {
      throw new NotFoundException('Product not found')
    }

    if (user.role === Role.RESELLER) {
      const inventory = await this.inventoryService.getInventory(user.id)
      if (!inventory || !inventory.products.includes(product.id)) {
        throw new ForbiddenException('Product not available in your inventory')
      }
    }

    return product
  }
}
