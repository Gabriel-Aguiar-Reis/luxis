import { SaleByResellerReturnDto } from '@/modules/kpi/admin/application/dtos/sale/sale-by-reseller-return.dto'
import { ApiProperty } from '@nestjs/swagger'

export class SalesByResellerDto {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '1e23f456-e789-12d3-a456-426614174000'
  })
  public resellerId: string

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'John Doe'
  })
  public resellerName: string

  @ApiProperty({
    description: 'The sales made by the reseller',
    type: [SaleByResellerReturnDto]
  })
  public sales: SaleByResellerReturnDto[]

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
