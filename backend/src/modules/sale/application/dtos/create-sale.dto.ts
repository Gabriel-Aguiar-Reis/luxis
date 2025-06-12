import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsUUID,
  Min
} from 'class-validator'
import { UUID } from 'crypto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { ApiProperty } from '@nestjs/swagger'

export class CreateSaleDto {
  @ApiProperty({
    description: 'The IDs of the products',
    example: [
      '123e4567-e89b-12d3-a456-426614174000',
      '123e4567-e89b-12d3-a456-426614174001'
    ],
    type: [String],
    required: true
  })
  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []

  @ApiProperty({
    description: 'The date of the sale',
    example: '2021-01-01',
    type: Date,
    required: true
  })
  @IsDate()
  @IsNotEmpty()
  saleDate: Date

  @ApiProperty({
    description: 'The payment method of the sale',
    enum: PaymentMethod,
    example: PaymentMethod.CREDIT,
    enumName: 'PaymentMethod',
    required: true
  })
  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod

  @ApiProperty({
    description: 'The number of installments of the sale',
    default: 1,
    type: String,
    required: true
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  numberInstallments: number = 1

  @ApiProperty({
    description: 'The interval of installments of the sale',
    default: 0,
    type: String,
    required: true
  })
  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(0)
  installmentsInterval: number = 0

  @ApiProperty({
    description: 'The ID of the consumer',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsNotEmpty()
  @IsUUID()
  customerId: UUID
}
