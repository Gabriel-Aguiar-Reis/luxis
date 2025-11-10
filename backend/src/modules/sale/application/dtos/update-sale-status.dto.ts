import { IsEnum, IsNotEmpty } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { SaleStatus } from '@/modules/sale/domain/enums/sale-status.enum'

export class UpdateSaleStatusDto {
  @ApiProperty({
    description: 'The new status of the sale',
    example: SaleStatus.INSTALLMENTS_PENDING,
    enum: SaleStatus,
    type: String,
    required: true
  })
  @IsEnum(SaleStatus)
  @IsNotEmpty()
  status: SaleStatus
}
