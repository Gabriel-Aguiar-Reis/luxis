import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import {
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
  IsOptional
} from 'class-validator'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new name for the user',
    minLength: 2,
    maxLength: 50,
    example: 'John',
    type: String
  })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The new last name for the user',
    minLength: 2,
    maxLength: 50,
    example: 'Doe',
    type: String
  })
  @IsString()
  @Length(2, 50)
  @IsOptional()
  surname?: string

  @ApiProperty({
    description: 'The new phone number for the user',
    example: '+5511999999999',
    type: String
  })
  @IsString()
  @IsOptional()
  phone?: string

  @ApiProperty({
    description: 'The new email for the user',
    example: 'john.doe@example.com',
    type: String
  })
  @IsEmail()
  @IsOptional()
  email?: string

  @ApiProperty({
    description: 'The new password for the user',
    example: 'Password@123',
    type: String
  })
  @IsString()
  @IsOptional()
  password?: string

  @ApiProperty({
    description: 'The new street for the user',
    example: 'Rua das Flores',
    type: String
  })
  @IsString()
  @IsOptional()
  street?: string

  @ApiProperty({
    description: 'The new number for the user',
    example: 123,
    type: Number
  })
  @IsNumber()
  @IsOptional()
  number?: number

  @ApiProperty({
    description: 'The new complement for the user',
    example: 'Apto 101',
    type: String
  })
  @IsString()
  @IsOptional()
  complement?: string

  @ApiProperty({
    description: 'The new neighborhood for the user',
    example: 'Bairro das Flores',
    type: String
  })
  @IsString()
  @IsOptional()
  neighborhood?: string

  @ApiProperty({
    description: 'The new city for the user',
    example: 'São Paulo',
    type: String
  })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({
    description: 'The new federative unit for the user',
    enum: FederativeUnit,
    example: FederativeUnit.SP,
    enumName: 'FederativeUnit'
  })
  @IsEnum(FederativeUnit)
  @IsOptional()
  federativeUnit?: FederativeUnit

  @ApiProperty({
    description: 'The new postal code for the user',
    example: '01234-567',
    type: String
  })
  @IsString()
  @IsOptional()
  postalCode?: string

  @ApiProperty({
    description: 'The new country for the user',
    enum: Country,
    example: Country.BRAZIL,
    enumName: 'Country'
  })
  @IsString()
  @IsOptional()
  country?: Country
}
