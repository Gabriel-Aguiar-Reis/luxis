import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsOptional } from 'class-validator'
export class UpdateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: string
}
