import { ApiProperty } from '@nestjs/swagger'

export class TotalReturnsInPeriodDto {
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
    description: 'The total returns in the period',
    type: Number
  })
  public totalReturns: number
}
