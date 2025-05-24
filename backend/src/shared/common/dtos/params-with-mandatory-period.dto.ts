import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsNotEmpty, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ParamsWithMandatoryPeriodDto {
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-01-01'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  start: Date

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-01-01'
  })
  @IsNotEmpty()
  @IsDate()
  @Type(() => Date)
  end: Date

  @ApiPropertyOptional({
    type: 'number',
    example: 10
  })
  @IsOptional()
  @IsNumber()
  limit?: number

  @ApiPropertyOptional({
    type: 'number',
    example: 1
  })
  @IsOptional()
  @IsNumber()
  page?: number
}
