import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { IInventoryService } from '@/modules/inventory/domain/services/inventory.interface'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { UserProductDto } from '@/modules/user/application/dtos/user-product.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetUserProductsUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('InventoryService')
    private readonly inventoryService: IInventoryService,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(userId: UUID, user: UserPayload): Promise<UserProductDto[]> {
    // Verificar se o usuário existe
    const targetUser = await this.userRepository.findById(userId)
    if (!targetUser) {
      throw new NotFoundException('User not found')
    }

    // Apenas revendedores têm inventário
    if (targetUser.role !== Role.RESELLER) {
      return []
    }

    // Buscar inventário do revendedor
    const inventory = await this.inventoryService.getInventory(userId, user)
    if (!inventory || inventory.products.length === 0) {
      return []
    }

    // Buscar produtos do inventário
    const products = await this.productRepository.findManyByIds(
      inventory.products
    )
    if (products.length === 0) {
      return []
    }

    // Buscar modelos dos produtos
    const modelIds = [...new Set(products.map((p) => p.modelId))]
    const models = await this.productModelRepository.findManyByIds(modelIds)
    const modelMap = new Map(models.map((m) => [m.id, m]))

    // Mapear para DTO
    return products.map((product) => {
      const model = modelMap.get(product.modelId)
      if (!model) {
        throw new NotFoundException(`Model not found for product ${product.id}`)
      }
      return {
        id: product.id,
        serialNumber: product.serialNumber,
        modelName: model.name,
        modelId: product.modelId,
        status: product.status,
        price: product.salePrice,
        salePrice: product.salePrice
      }
    })
  }
}
