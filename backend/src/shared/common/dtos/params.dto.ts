import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsDate, IsNumber, IsOptional } from 'class-validator'
import { Type } from 'class-transformer'

export class ParamsDto {
  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-01-01',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  start?: Date

  @ApiProperty({
    type: 'string',
    format: 'date',
    example: '2025-01-01',
    required: false
  })
  @IsOptional()
  @IsDate()
  @Type(() => Date)
  end?: Date

  @ApiPropertyOptional({
    type: 'number',
    example: 10,
    required: false
  })
  @IsOptional()
  @IsNumber()
  limit?: number

  @ApiPropertyOptional({
    type: 'number',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsNumber()
  page?: number
}
