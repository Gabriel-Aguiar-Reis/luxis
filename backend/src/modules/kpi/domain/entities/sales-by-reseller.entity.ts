import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { User } from '@/modules/user/domain/entities/user.entity'
import { Currency } from '@/shared/common/value-object/currency.vo'
import { ApiProperty } from '@nestjs/swagger'

export class SalesByReseller {
  @ApiProperty({
    description: 'The reseller of the sales',
    type: User
  })
  public reseller: User

  @ApiProperty({
    description: 'The sales made by the reseller',
    type: [Sale]
  })
  public sales: Sale[]

  @ApiProperty({
    description: 'The total sales amount made by the reseller',
    example: '1000.00',
    type: String
  })
  public totalSales: Currency
  @ApiProperty({
    description: 'The number of sales made by the reseller',
    example: 10,
    type: Number
  })
  public salesCount: number
}
