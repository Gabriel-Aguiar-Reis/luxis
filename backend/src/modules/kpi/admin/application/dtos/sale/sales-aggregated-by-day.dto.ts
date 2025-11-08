import { ApiProperty } from '@nestjs/swagger'

export class SaleAggregatedByDayDto {
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-11-01'
  })
  date: string

  @ApiProperty({
    type: 'number',
    example: 10
  })
  sales: number

  @ApiProperty({
    type: 'string',
    example: '15000.50'
  })
  totalAmount: string
}

export class SalesAggregatedByDayDto {
  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  start: Date

  @ApiProperty({
    type: 'string',
    format: 'date-time'
  })
  end: Date

  @ApiProperty({
    type: [SaleAggregatedByDayDto]
  })
  data: SaleAggregatedByDayDto[]
}
