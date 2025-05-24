import { ApiProperty } from '@nestjs/swagger'

export class TotalSalesByResellerDto {
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
    description: 'The number of sales made by the reseller',
    example: 10
  })
  public salesCount: number
}
