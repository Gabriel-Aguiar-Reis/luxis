import { Unit } from '@/shared/common/value-object/unit.vo'
import { IsNumber, IsPositive, Min } from 'class-validator'

export class MarkInstallmentPaidDto {
  @IsNumber()
  @IsPositive()
  @Min(1)
  installmentNumber: Unit
}
