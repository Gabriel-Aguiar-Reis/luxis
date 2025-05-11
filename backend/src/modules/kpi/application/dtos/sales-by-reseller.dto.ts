import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { ApiProperty } from '@nestjs/swagger'

export class SalesByResellerDto {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '1234567890'
  })
  public resellerId: string

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'John Doe'
  })
  public resellerName: string

  @ApiProperty({
    description: 'The sales made by the reseller',
    type: [Sale]
  })
  public sales: Sale[]

  @ApiProperty({
    description: 'The total sales amount made by the reseller',
    example: '1000.00'
  })
  public totalSales: string

  @ApiProperty({
    description: 'The number of sales made by the reseller',
    example: 10
  })
  public salesCount: number
}
