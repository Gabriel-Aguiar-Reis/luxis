import { SaleReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-return.dto'
import { ApiProperty } from '@nestjs/swagger'

export class SalesInPeriodDto {
  @ApiProperty({
    description: 'The start date of the period',
    example: '2023-01-01T00:00:00Z'
  })
  public start: Date

  @ApiProperty({
    description: 'The end date of the period',
    example: '2023-01-31T23:59:59Z'
  })
  public end: Date

  @ApiProperty({
    description: 'The returned sales in the period',
    type: [SaleReturnDto]
  })
  public sales: SaleReturnDto[]
}
