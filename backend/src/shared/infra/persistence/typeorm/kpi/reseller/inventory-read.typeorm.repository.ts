import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { InventoryReadRepository } from '@/modules/kpi/reseller/domain/repositories/inventory-read.repository'
import { InventoryProductModelDto } from '@/modules/kpi/reseller/application/dtos/inventory/inventory-product-model.dto'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'

@Injectable()
export class InventoryReadTypeormRepository implements InventoryReadRepository {
  constructor(
    private readonly inventoryRepo: Repository<InventoryTypeOrmEntity>,
    private readonly productRepo: Repository<ProductTypeOrmEntity>,
    private readonly productModelRepo: Repository<ProductModelTypeOrmEntity>
  ) {}

  async currentInventory(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<InventoryProductModelDto[]> {
    const inventory = await this.inventoryRepo.findOne({
      where: { resellerId }
    })

    if (!inventory || inventory.productIds.length === 0) {
      return []
    }

    const qb = this.productRepo
      .createQueryBuilder('product')
      .where('product.id IN (:...productIds)', {
        productIds: inventory.productIds
      })
      .andWhere('product.status = :status', { status: ProductStatus.ASSIGNED })

    const filteredProducts = baseWhere(qb, qParams, 'non-usable')

    const products = await filteredProducts.getMany()

    if (products.length === 0) {
      return []
    }

    const modelIds = [...new Set(products.map((product) => product.modelId))]

    const productModels = await this.productModelRepo
      .createQueryBuilder('model')
      .where('model.id IN (:...modelIds)', { modelIds })
      .getMany()

    const productsByModel = products.reduce(
      (acc, product) => {
        if (!acc[product.modelId]) {
          acc[product.modelId] = []
        }
        acc[product.modelId].push(product)
        return acc
      },
      {} as Record<string, ProductTypeOrmEntity[]>
    )

    return productModels.map((model) => {
      const modelProducts = productsByModel[model.id] || []

      return {
        modelId: model.id.toString(),
        modelName: model.name,
        quantity: modelProducts.length,
        products: modelProducts.map((product) => ({
          id: product.id.toString(),
          serialNumber: product.serialNumber,
          salePrice: product.salePrice.toString()
        }))
      }
    })
  }
}
