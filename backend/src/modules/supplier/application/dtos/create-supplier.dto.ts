import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: string

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  phone: string
}
