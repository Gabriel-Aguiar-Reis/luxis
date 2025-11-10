import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { InventoryRepository } from '@/modules/inventory/domain/repositories/inventory.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { GetAvailableProductsToSellDto } from '@/modules/sale/application/dtos/get-available-products-to-sell.dto'
import { GetAvailableCategoryDto } from '@/modules/sale/application/dtos/get-available-category.dto'
import { GetAvailableProductModelDto } from '@/modules/sale/application/dtos/get-available-product-model.dto'
import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'

@Injectable()
export class GetAvailableProductsToSellUseCase {
  constructor(
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('InventoryRepository')
    private readonly inventoryRepository: InventoryRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository
  ) {}

  async execute(user: UserPayload): Promise<GetAvailableProductsToSellDto> {
    if (!user) {
      throw new NotFoundException('Usuário não encontrado')
    }

    let products: Product[] = []
    if (user.role === Role.RESELLER) {
      const inventory = await this.inventoryRepository.findByResellerId(user.id)
      if (!inventory) {
        return { data: [] }
      }
      const resellerProducts = await this.productRepository.findManyByIds(
        inventory.products
      )
      products = resellerProducts.filter(
        (p) => p.status === ProductStatus.ASSIGNED
      )
    } else {
      const allProducts = await this.productRepository.findAll()
      products = allProducts.filter((p) => p.status === ProductStatus.IN_STOCK)
    }

    if (products.length === 0) {
      return { data: [] }
    }

    // Agrupa modelos distintos dos produtos encontrados
    const modelIds = [...new Set(products.map((p) => p.modelId))]
    const models = await this.productModelRepository.findManyByIds(modelIds)
    if (models.length === 0) {
      return { data: [] }
    }

    // Busca somente as categorias necessárias evitando um findAll custoso
    const categoryIds = [...new Set(models.map((m) => m.categoryId))]
    const categories = await Promise.all(
      categoryIds.map((id) => this.categoryRepository.findById(id))
    )
    const validCategories = categories.filter(
      (c): c is NonNullable<typeof c> => !!c
    )

    const modelMap = new Map(models.map((m) => [m.id, m]))
    const categoryMap = new Map(validCategories.map((c) => [c.id, c]))

    // Agrupa produtos por modelo
    const productsByModel = new Map<string, GetSaleProductDto[]>()
    for (const p of products) {
      const list = productsByModel.get(p.modelId as unknown as string) ?? []
      const model = modelMap.get(p.modelId)
      const category = model ? categoryMap.get(model.categoryId) : undefined
      if (model && category) {
        list.push({
          id: p.id,
          serialNumber: p.serialNumber,
          salePrice: p.salePrice,
          modelId: p.modelId,
          categoryId: model.categoryId,
          modelName: model.name,
          categoryName: category.name
        })
      }
      productsByModel.set(p.modelId as unknown as string, list)
    }

    // Monta modelos disponíveis com seus produtos
    const modelsDto: GetAvailableProductModelDto[] = []
    for (const model of models) {
      const modelProducts =
        productsByModel.get(model.id as unknown as string) || []
      if (modelProducts.length === 0) continue
      modelsDto.push({
        id: model.id,
        modelName: model.name,
        imageUrl: model.photoUrl,
        products: modelProducts
      })
    }

    // Agrupa modelos por categoria
    const modelsByCategory = new Map<string, GetAvailableProductModelDto[]>()
    for (const m of modelsDto) {
      const model = modelMap.get(m.id)
      if (!model) continue
      const list =
        modelsByCategory.get(model.categoryId as unknown as string) ?? []
      list.push(m)
      modelsByCategory.set(model.categoryId as unknown as string, list)
    }

    // Monta categorias com seus modelos
    const categoriesDto: GetAvailableCategoryDto[] = []
    for (const category of validCategories) {
      const catModels =
        modelsByCategory.get(category.id as unknown as string) || []
      if (catModels.length === 0) continue
      categoriesDto.push({
        categoryId: category.id,
        categoryName: category.name,
        models: catModels
      })
    }

    return { data: categoriesDto }
  }
}
