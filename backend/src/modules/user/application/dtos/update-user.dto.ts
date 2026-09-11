import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import {
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
  IsOptional
} from 'class-validator'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsBrazilianPhone } from '@/shared/common/validators/is-brazilian-phone.validator'

export class UpdateUserDto {
  @ApiProperty({
    description: 'The new name for the user',
    minLength: 2,
    maxLength: 50,
    example: 'John',
    type: String,
    required: false
  })
  @IsString({ message: 'Nome deve ser texto.' })
  @Length(2, 50, { message: 'Nome deve ter entre 2 e 50 caracteres.' })
  @IsOptional()
  name?: string

  @ApiProperty({
    description: 'The new last name for the user',
    minLength: 2,
    maxLength: 50,
    example: 'Doe',
    type: String,
    required: false
  })
  @IsString({ message: 'Sobrenome deve ser texto.' })
  @Length(2, 50, { message: 'Sobrenome deve ter entre 2 e 50 caracteres.' })
  @IsOptional()
  surname?: string

  @ApiProperty({
    description: 'The new phone number for the user',
    example: '+5511999999999',
    type: String,
    required: false
  })
  @IsString({ message: 'Telefone deve ser texto.' })
  @IsBrazilianPhone()
  @IsOptional()
  phone?: string

  @ApiProperty({
    description: 'The new email for the user',
    example: 'john.doe@example.com',
    type: String,
    required: false
  })
  @IsEmail({}, { message: 'Informe um email valido.' })
  @IsOptional()
  email?: string

  @ApiProperty({
    description: 'The new password for the user',
    example: 'Password@123',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  password?: string

  @ApiProperty({
    description: 'The new street for the user',
    example: 'Rua das Flores',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  street?: string

  @ApiProperty({
    description: 'The new number for the user',
    example: 123,
    type: Number,
    required: false
  })
  @IsNumber()
  @IsOptional()
  number?: number

  @ApiProperty({
    description: 'The new complement for the user',
    example: 'Apto 101',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  complement?: string

  @ApiProperty({
    description: 'The new neighborhood for the user',
    example: 'Bairro das Flores',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  neighborhood?: string

  @ApiProperty({
    description: 'The new city for the user',
    example: 'São Paulo',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  city?: string

  @ApiProperty({
    description: 'The new federative unit for the user',
    enum: FederativeUnit,
    example: FederativeUnit.SP,
    enumName: 'FederativeUnit',
    required: false
  })
  @IsEnum(FederativeUnit)
  @IsOptional()
  federativeUnit?: FederativeUnit

  @ApiProperty({
    description: 'The new postal code for the user',
    example: '01234-567',
    type: String,
    required: false
  })
  @IsString()
  @IsOptional()
  postalCode?: string

  @ApiProperty({
    description: 'The new country for the user',
    enum: Country,
    example: Country.BRAZIL,
    enumName: 'Country',
    required: false
  })
  @IsString()
  @IsOptional()
  country?: Country
}
