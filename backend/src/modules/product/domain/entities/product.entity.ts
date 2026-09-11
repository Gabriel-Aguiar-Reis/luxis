import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { SerialNumber } from '@/modules/product/domain/value-objects/serial-number.vo'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { UUID } from 'crypto'

export class Product {
  public readonly id: UUID

  public serialNumber: SerialNumber

  public modelId: UUID

  public batchId: UUID

  public unitCost: Currency

  public salePrice: Currency

  public status: ProductStatus

  constructor(
    id: UUID,
    serialNumber: SerialNumber,
    modelId: UUID,
    batchId: UUID,
    unitCost: Currency,
    salePrice: Currency,
    status: ProductStatus = ProductStatus.IN_STOCK
  ) {
    this.id = id
    this.serialNumber = serialNumber
    this.modelId = modelId
    this.batchId = batchId
    this.unitCost = unitCost
    this.salePrice = salePrice
    this.status = status
  }
}
