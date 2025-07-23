import { SaleReturnProductDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return-product.dto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class SaleReturnDto {
  @ApiProperty({
    description: 'The ID of the sale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public id: UUID

  @ApiProperty({
    description: 'The ID of the consumer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public customerId: UUID

  @ApiProperty({
    description: 'The name of the consumer',
    example: 'John Doe',
    type: String
  })
  public customerName: string

  @ApiProperty({
    description: 'The phone number of the consumer',
    example: '+5512934567890',
    type: String
  })
  public customerPhone: string

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'John Doe',
    type: String
  })
  public resellerName: string

  @ApiProperty({
    description: 'The phone number of the reseller',
    example: '+5512934567890',
    type: String
  })
  public resellerPhone: string

  @ApiProperty({
    description: 'The IDs of the products in the sale',
    example: [
      {
        productId: '123e4567-e89b-12d3-a456-426614174000',
        productModelId: '123e4567-e89b-12d3-a456-426614174001',
        productModelName: 'iPhone 13 Pro Max',
        salePrice: '150.00'
      }
    ],
    type: [SaleReturnProductDto]
  })
  public products: SaleReturnProductDto[]

  @ApiProperty({
    description: 'The date of the sale',
    example: '2023-01-01T00:00:00Z'
  })
  public saleDate: Date

  @ApiProperty({
    description: 'The total amount of the sale',
    example: '1000.00',
    type: String
  })
  public totalAmount: string

  @ApiProperty({
    description: 'The payment method of the sale',
    enum: PaymentMethod,
    example: PaymentMethod.DEBIT,
    type: String
  })
  public paymentMethod: string
  @ApiProperty({
    description: 'The number of installments of the sale',
    example: 1,
    type: Number
  })
  public numberInstallments: number

  @ApiProperty({
    description: 'The interval between installments of the sale',
    example: 30,
    type: Number
  })
  public installmentsInterval: number

  @ApiProperty({
    description: 'The number of installments paid for the sale',
    example: 1,
    type: Number
  })
  public installmentsPaid: number

  @ApiProperty({
    description: 'The status of the sale',
    enum: SaleStatus,
    example: SaleStatus.CONFIRMED,
    type: String
  })
  public status: string
}
