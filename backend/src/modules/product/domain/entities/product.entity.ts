import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'

export class Product {
  constructor(
    public readonly id: string,
    public serialNumber: string,
    public modelId: string,
    public batchId: string,
    public resellerId: string,
    public unitCost: string,
    public salePrice: string,
    public status: ProductStatus = ProductStatus.IN_STOCK
  ) {}
}
