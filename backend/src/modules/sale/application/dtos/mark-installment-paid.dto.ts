import { IsNumber, IsPositive, Min } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class MarkInstallmentPaidDto {
  @ApiProperty({
    description: 'The number of the installment to be marked as paid',
    default: 1,
    type: Number,
    required: true
  })
  @IsNumber()
  @IsPositive()
  @Min(1)
  installmentNumber: number
}
