import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IsOptional } from 'class-validator'

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+5511999999999',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: string
}
