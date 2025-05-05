import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsString } from 'class-validator'
import { IsOptional } from 'class-validator'

export class UpdateCustomerDto {
  @ApiProperty({
    description: 'The name of the customer',
    example: 'John Doe',
    type: Name,
    required: false
  })
  @IsString()
  @IsOptional()
  name?: Name

  @ApiProperty({
    description: 'The phone number of the customer',
    example: '+5511999999999',
    type: PhoneNumber,
    required: false
  })
  @IsString()
  @IsOptional()
  phone?: PhoneNumber
}
