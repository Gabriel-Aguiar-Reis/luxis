import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty } from 'class-validator'

export class CreateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: Name
  })
  @IsString()
  @IsNotEmpty()
  name: Name

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+5511999999999',
    type: PhoneNumber
  })
  @IsString()
  @IsNotEmpty()
  phone: PhoneNumber
}
