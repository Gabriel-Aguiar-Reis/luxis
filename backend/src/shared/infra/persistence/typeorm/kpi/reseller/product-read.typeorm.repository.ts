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
    private readonly saleRepo: Repository<SaleTypeOrmEntity>
  ) {}

  async topSellingProducts(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SellingProductDto[]> {
    const params: unknown[] = [resellerId]
    const where = ['sale.reseller_id = $1']

    if (qParams.start) {
      params.push(qParams.start)
      where.push(`sale.sale_date >= $${params.length}`)
    }

    if (qParams.end) {
      params.push(qParams.end)
      where.push(`sale.sale_date <= $${params.length}`)
    }

    const limit = qParams.limit && qParams.limit > 0 ? qParams.limit : 10
    const page = qParams.page && qParams.page > 0 ? qParams.page : 1
    params.push(limit, (page - 1) * limit)
    const limitParam = params.length - 1
    const offsetParam = params.length

    const rows = await this.saleRepo.query(
      `
        SELECT
          model.id::text AS "modelId",
          model.name AS "modelName",
          COUNT(*)::int AS "quantity",
          MAX(product.sale_price)::text AS "salePrice",
          COALESCE(SUM(product.sale_price), 0)::text AS "totalValue"
        FROM sales sale
        INNER JOIN sale_products sale_product ON sale_product.sale_id = sale.id
        INNER JOIN products product ON product.id = sale_product.product_id
        INNER JOIN product_models model ON model.id = product.model_id
        WHERE ${where.join(' AND ')}
        GROUP BY model.id, model.name
        ORDER BY COUNT(*) DESC, model.name ASC
        LIMIT $${limitParam} OFFSET $${offsetParam}
      `,
      params
    )

    return rows.map((row: SellingProductDto) => ({
      modelId: row.modelId,
      modelName: row.modelName,
      quantity: Number(row.quantity),
      salePrice: row.salePrice,
      totalValue: row.totalValue
    }))
  }

  async productsWithLongestTimeInInventory(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ProductInInventoryDto[]> {
    const qb = this.productRepo
      .createQueryBuilder('product')
      .innerJoin(BatchTypeOrmEntity, 'batch', 'batch.id = product.batch_id')
      .innerJoin(
        'inventory_products',
        'inventoryProduct',
        'inventoryProduct.product_id = product.id'
      )
      .addSelect('batch.arrival_date')
      .where('inventoryProduct.reseller_id = :resellerId', { resellerId })
      .andWhere('product.status = :status', { status: ProductStatus.ASSIGNED })
      .orderBy('batch.arrival_date', 'ASC')

    const filteredProducts = baseWhere(qb, qParams, 'batch.arrival_date')
    const rawProducts = await filteredProducts.getRawAndEntities()

    if (rawProducts.entities.length === 0) {
      return []
    }

    const products = rawProducts.entities
    const rawData = rawProducts.raw

    const modelIds = [...new Set(products.map((product) => product.modelId))]
    const productModels = await this.productModelRepo
      .createQueryBuilder('model')
      .where('CAST(model.id AS text) IN (:...modelIds)', { modelIds })
      .getMany()

    const modelsById = productModels.reduce(
      (acc, model) => {
        acc[model.id] = model
        return acc
      },
      {} as Record<string, ProductModelTypeOrmEntity>
    )

    return products.slice(0, 10).map((product, index) => {
      const model = modelsById[product.modelId]
      const raw = rawData[index]
      return {
        id: product.id.toString(),
        serialNumber: product.serialNumber,
        modelId: model.id.toString(),
        modelName: model.name,
        salePrice: product.salePrice.toString(),
        dateAcquired: raw.batch_arrival_date
      }
    })
  }
}
