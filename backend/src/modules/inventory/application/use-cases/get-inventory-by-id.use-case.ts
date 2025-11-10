import { InventoryProductIdDto } from '@/modules/inventory/application/dtos/get-inventory-by-id-product-return.dto'
import { GetInventoryByIdReturnDto } from '@/modules/inventory/application/dtos/get-inventory-by-id-return.dto'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetInventoryByIdUseCase {
  constructor(
    private readonly inventoryService: InventoryService,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
  ) {}

  async execute(
    id: UUID, user: UserPayload
  ): Promise<GetInventoryByIdReturnDto> {
    let inventory = await this.inventoryService.getInventory(id, user)
    if (!inventory) {
      throw new NotFoundException('Inventory not found')
    }
    const productIds = inventory.products
    const products = await this.productRepository.findManyByIds(productIds)
    const modelIds = [...new Set(products.map(p => p.modelId))]
    const models = await this.productModelRepository.findManyByIds(modelIds)
    const modelMap = new Map(models.map(m => [m.id, m]))

    const productMap = new Map(products.map(p => [p.id, p]))

    function getFullName(user?: { name: { getValue(): string }, surname: { getValue(): string } }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    const reseller = await this.userRepository.findById(inventory.resellerId)
    if (!reseller) {
      throw new NotFoundException('Reseller not found')
    }

    return {
      resellerId: inventory.resellerId,
      resellerName: getFullName(reseller),
      products: inventory.products.map(pid => {
        const prod = productMap.get(pid)
        if (!prod) {
          throw new NotFoundException(`Product with ID ${pid} not found`)
        }
        return prod
      }),
      productModels: modelMap.size > 0 ? Array.from(modelMap.values()) : []
    }
  }
}
