import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { Repository } from 'typeorm'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { baseWhere } from '@/shared/common/utils/query-builder.helper'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { UUID } from 'crypto'

type ProductWithResellerRawResult = {
  id: UUID
  serialNumber: string
  modelId: UUID
  modelName: string
  batchId: UUID
  unitCost: string
  salePrice: string
  status: string
}

export async function productsWithResellers(
  productRepo: Repository<ProductTypeOrmEntity>,
  qParams: ParamsDto
): Promise<ProductWithResellerDto[]> {
  const qb = productRepo
    .createQueryBuilder('product')
    .innerJoin(
      ProductModelTypeOrmEntity,
      'productModel',
      'productModel.id = product.model_id'
    )
    .select([
      'product.id as "id"',
      'product.serial_number as "serialNumber"',
      'product.model_id as "modelId"',
      'productModel.name as "modelName"',
      'product.batch_id as "batchId"',
      'product.unit_cost as "unitCost"',
      'product.sale_price as "salePrice"',
      'product.status as "status"'
    ])
    .where('product.status = :status', { status: ProductStatus.ASSIGNED })
  const filteredProducts = baseWhere(qb, qParams, 'product.created_at')

  const result =
    await filteredProducts.getRawMany<ProductWithResellerRawResult>()

  return result.map((row) => ({
    id: row.id,
    serialNumber: row.serialNumber,
    modelId: row.modelId,
    modelName: row.modelName,
    batchId: row.batchId,
    unitCost: row.unitCost,
    salePrice: row.salePrice
  }))
}
