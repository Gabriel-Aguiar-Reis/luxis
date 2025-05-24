import { ApiProperty } from '@nestjs/swagger'

export class MonthlySalesDto {
  @ApiProperty({ example: 1, description: 'Month number (1-12)', type: Number })
  month: number

  @ApiProperty({ example: 1, description: 'Number of sales', type: Number })
  countSales: number

  @ApiProperty({
    example: '1000',
    description: 'Total sales amount',
    type: String
  })
  totalAmount: string
}
