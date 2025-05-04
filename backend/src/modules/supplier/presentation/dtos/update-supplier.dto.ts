import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsOptional } from 'class-validator'
export class UpdateSupplierDto {
  @ApiProperty({
    description: 'The name of the supplier',
    example: 'John Doe',
    type: Name
  })
  @IsString()
  @IsNotEmpty()
  name?: Name

  @ApiProperty({
    description: 'The phone number of the supplier',
    example: '+5511999999999',
    type: PhoneNumber
  })
  @IsString()
  @IsOptional()
  phone?: PhoneNumber
}
