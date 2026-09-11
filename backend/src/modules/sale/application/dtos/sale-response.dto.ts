import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import {
  IsArray,
  IsDate,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsString,
  IsUUID
} from 'class-validator'
import { UUID } from 'crypto'

export class SaleResponseDto {
  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  id: UUID

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174001'
  })
  @IsUUID()
  @IsNotEmpty()
  customerId: UUID

  @ApiProperty({
    type: String,
    example: '123e4567-e89b-12d3-a456-426614174002'
  })
  @IsUUID()
  @IsNotEmpty()
  resellerId: UUID

  @ApiProperty({
    type: [String],
    example: ['123e4567-e89b-12d3-a456-426614174003']
  })
  @IsArray()
  @IsUUID('4', { each: true })
  productIds: UUID[]

  @ApiProperty({ type: Date, example: '2024-01-01T00:00:00.000Z' })
  @IsDate()
  saleDate: Date

  @ApiProperty({ type: String, example: '1000.00' })
  @IsString()
  totalAmount: string

  @ApiProperty({ enum: PaymentMethod, example: PaymentMethod.DEBIT })
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod

  @ApiProperty({ type: Number, example: 12 })
  @IsNumber()
  numberInstallments: number

  @ApiProperty({ enum: SaleStatus, example: SaleStatus.CONFIRMED })
  @IsEnum(SaleStatus)
  status: SaleStatus

  @ApiProperty({ type: Number, example: 30 })
  @IsNumber()
  installmentsInterval: number

  @ApiProperty({ type: Number, example: 3 })
  @IsNumber()
  installmentsPaid: number
}
