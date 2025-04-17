import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { UUID } from 'crypto'

export class Product {
  constructor(
    public readonly id: UUID,
    public serialNumber: string,
    public modelId: UUID,
    public batchId: UUID,
    public unitCost: string,
    public salePrice: string,
    public status: ProductStatus = ProductStatus.IN_STOCK
  ) {}
}
