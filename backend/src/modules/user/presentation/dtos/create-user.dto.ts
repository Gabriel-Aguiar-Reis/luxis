import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import {
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
  IsOptional,
  IsNotEmpty
} from 'class-validator'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    minLength: 2,
    maxLength: 50,
    type: Name,
    example: 'John'
  })
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  name: Name

  @ApiProperty({
    description: 'User last name',
    minLength: 2,
    maxLength: 50,
    type: Name,
    example: 'Doe'
  })
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  surName: Name

  @ApiProperty({
    description: 'User phone number',
    example: '+5511999999999',
    type: PhoneNumber
  })
  @IsString()
  @IsNotEmpty()
  phone: PhoneNumber

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    type: Email
  })
  @IsEmail()
  @IsNotEmpty()
  email: Email

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    example: 'Password@123',
    type: Password
  })
  @IsString()
  @IsNotEmpty()
  password: Password

  @ApiProperty({
    description: 'Street address',
    example: '123 Main St',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({
    description: 'Address number',
    example: 123,
    type: Number
  })
  @IsNumber()
  @IsNotEmpty()
  number: number

  @ApiProperty({
    description: 'Address complement',
    required: false,
    example: 'Apt 101',
    type: String
  })
  @IsString()
  @IsOptional()
  complement: string

  @ApiProperty({
    description: 'Neighborhood',
    example: 'Center',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @ApiProperty({
    description: 'City',
    example: 'São Paulo',
    type: String
  })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({
    description: 'Federative unit',
    enum: FederativeUnit,
    example: FederativeUnit.SP,
    type: FederativeUnit,
    enumName: 'FederativeUnit'
  })
  @IsEnum(FederativeUnit)
  @IsNotEmpty()
  federativeUnit: FederativeUnit

  @ApiProperty({
    description: 'Postal code',
    example: '01234-567',
    type: PostalCode
  })
  @IsString()
  @IsNotEmpty()
  postalCode: PostalCode

  @ApiProperty({
    description: 'Country',
    enum: Country,
    example: Country.Brazil,
    type: Country,
    enumName: 'Country'
  })
  @IsString()
  @IsNotEmpty()
  country: Country
}
