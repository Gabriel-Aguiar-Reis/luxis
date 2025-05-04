import {
  ArrayNotEmpty,
  IsArray,
  IsDate,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  Min
} from 'class-validator'
import { UUID } from 'crypto'
import { PaymentMethod } from '@/modules/sale/domain/enums/payment-method.enum'
import { Unit } from '@/shared/common/value-object/unit.vo'

export class CreateSaleDto {
  @IsArray()
  @ArrayNotEmpty()
  productIds: UUID[] = []

  @IsDate()
  @IsNotEmpty()
  saleDate: Date

  @IsEnum(PaymentMethod)
  @IsNotEmpty()
  paymentMethod: PaymentMethod

  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(1)
  numberInstallments: Unit = new Unit(1)

  @IsNumber()
  @IsPositive()
  @IsInt()
  @Min(0)
  installmentsInterval: Unit = new Unit(0)
}
