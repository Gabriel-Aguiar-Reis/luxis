import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class Product {
  constructor(
    public readonly id: UUID,
    public serialNumber: string,
    public modelId: UUID,
    public batchId: UUID,
    public unitCost: Currency,
    public salePrice: Currency,
    public status: ProductStatus = ProductStatus.IN_STOCK
  ) {}
}
