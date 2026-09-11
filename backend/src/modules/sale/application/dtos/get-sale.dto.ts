import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class GetSaleDto {
  @ApiProperty({
    description: 'The ID of the sale',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID

  @ApiProperty({
    description: 'The ID of the customer',
    example: '123e4567-e89b-12d3-a456-426614174001',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  customerId: UUID

  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  customerName: string

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+5511999999999',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  customerPhone: string

  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174002',
    type: String,
    required: true
  })
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'Reseller Name',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  resellerName: string

  @ApiProperty({
    description: 'The products in the sale',
    type: [GetSaleProductDto],
    required: true
  })
  @IsArray()
  products: GetSaleProductDto[]

  @ApiProperty({
    description: 'The date of the sale',
    example: '2024-01-01',
    type: Date,
    required: true
  })
  @IsNotEmpty()
  saleDate: Date

  @ApiProperty({
    description: 'The total amount of the sale',
    example: '1000.00',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsString()
  totalAmount: string

  @ApiProperty({
    description: 'The payment method of the sale',
    enum: PaymentMethod,
    example: PaymentMethod.DEBIT,
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'The number of installments',
    example: 12,
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  numberInstallments: number

  @ApiProperty({
    description: 'The status of the sale',
    enum: SaleStatus,
    example: SaleStatus.INSTALLMENTS_PENDING,
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsEnum(SaleStatus)
  status: SaleStatus

  @ApiProperty({
    description: 'The interval between installments in days',
    example: 30,
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  installmentsInterval: number

  @ApiProperty({
    description: 'The number of installments paid',
    example: 3,
    type: Number,
    required: true
  })
  @IsNotEmpty()
  @IsNumber()
  installmentsPaid: number
}
