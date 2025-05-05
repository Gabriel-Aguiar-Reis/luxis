import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
    type: Name,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  name: Name

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: PhoneNumber,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  phone: PhoneNumber
}
