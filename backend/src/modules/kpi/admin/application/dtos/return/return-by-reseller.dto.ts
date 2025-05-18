import { ReturnDto } from '@/modules/kpi/admin/application/dtos/return/return.dto'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class ReturnByResellerDto {
  @ApiProperty({
    description: 'The ID of the reseller',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String
  })
  public resellerId: UUID

  @ApiProperty({
    description: 'The name of the reseller',
    example: 'John Doe',
    type: String
  })
  public resellerName: string

  @ApiProperty({
    description: 'The returns associated with the reseller',
    type: [ReturnDto]
  })
  public returns: ReturnDto[]

  @ApiProperty({
    description: 'The total number of returns for the reseller',
    example: 5,
    type: Number
  })
  public totalReturns: number
}
