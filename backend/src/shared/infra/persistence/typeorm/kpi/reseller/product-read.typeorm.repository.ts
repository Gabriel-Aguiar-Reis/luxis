import { Injectable } from '@nestjs/common'
import { Repository } from 'typeorm'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductReadRepository } from '@/modules/kpi/reseller/domain/repositories/product-read.repository'
import { SellingProductDto } from '@/modules/kpi/reseller/application/dtos/product/selling-product.dto'
import { ProductInInventoryDto } from '@/modules/kpi/reseller/application/dtos/product/product-in-inventory.dto'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { InjectRepository } from '@nestjs/typeorm'

@Injectable()
export class ProductReadTypeormRepository implements ProductReadRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly productRepo: Repository<ProductTypeOrmEntity>,
    @InjectRepository(ProductModelTypeOrmEntity)
    private readonly productModelRepo: Repository<ProductModelTypeOrmEntity>,
    @InjectRepository(SaleTypeOrmEntity)
    private readonly saleRepo: Repository<SaleTypeOrmEntity>,
    @InjectRepository(InventoryTypeOrmEntity)
    private readonly inventoryRepo: Repository<InventoryTypeOrmEntity>
  ) {}

  async topSellingProducts(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SellingProductDto[]> {
    const qb = this.saleRepo
      .createQueryBuilder('sale')
      .where('sale.reseller_id = :resellerId', { resellerId })

    const filteredSales = baseWhere(qb, qParams, 'sale.sale_date')
    const sales = await filteredSales.getMany()

    if (sales.length === 0) {
      return []
    }

    const soldProductIds = sales.flatMap((sale) => sale.productIds)

    const productCount = soldProductIds.reduce(
      (acc, productId) => {
        acc[productId] = (acc[productId] || 0) + 1
        return acc
      },
      {} as Record<string, number>
    )

    const topProductIds = Object.entries(productCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10)
      .map(([productId]) => productId)

    if (topProductIds.length === 0) {
      return []
    }

    const products = await this.productRepo
      .createQueryBuilder('product')
      .where('product.id IN (:...productIds)', { productIds: topProductIds })
      .getMany()

    const modelIds = [...new Set(products.map((product) => product.modelId))]
    const productModels = await this.productModelRepo
      .createQueryBuilder('model')
      .where('model.id IN (:...modelIds)', { modelIds })
      .getMany()

    const modelsById = productModels.reduce(
      (acc, model) => {
        acc[model.id] = model
        return acc
      },
      {} as Record<string, ProductModelTypeOrmEntity>
    )

    return products
      .map((product) => {
        const model = modelsById[product.modelId]
        const quantity = productCount[product.id]
        const salePrice = product.salePrice.toString()
        return {
          modelId: model.id.toString(),
          modelName: model.name,
          quantity,
          salePrice,
          totalValue: (Number(salePrice) * quantity).toString()
        }
      })
      .sort((a, b) => b.quantity - a.quantity)
  }

  async productsWithLongestTimeInInventory(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ProductInInventoryDto[]> {
    const inventory = await this.inventoryRepo.findOne({
      where: { resellerId }
    })

    if (!inventory || inventory.productIds.length === 0) {
      return []
    }

    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
      .where('product.id IN (:...productIds)', {
        productIds: inventory.productIds
      })
      .andWhere('product.status = :status', { status: ProductStatus.ASSIGNED })
      .orderBy('batch.created_at', 'ASC')

    const filteredProducts = baseWhere(qb, qParams, 'batch.created_at')
    const products = await filteredProducts.getMany()

    if (products.length === 0) {
      return []
    }

    const modelIds = [...new Set(products.map((product) => product.modelId))]
    const productModels = await this.productModelRepo
      .createQueryBuilder('model')
      .where('model.id IN (:...modelIds)', { modelIds })
      .getMany()

    const modelsById = productModels.reduce(
      (acc, model) => {
        acc[model.id] = model
        return acc
      },
      {} as Record<string, ProductModelTypeOrmEntity>
    )

    return products.slice(0, 10).map((product) => {
      const model = modelsById[product.modelId]
      return {
        id: product.id.toString(),
        serialNumber: product.serialNumber,
        modelId: model.id.toString(),
        modelName: model.name,
        salePrice: product.salePrice.toString()
      }
    })
  }
}
