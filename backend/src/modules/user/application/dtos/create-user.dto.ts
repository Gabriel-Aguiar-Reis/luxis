import {
  IsString,
  IsEmail,
  Length,
  IsEnum,
  IsNumber,
  IsOptional,
  IsNotEmpty
} from 'class-validator'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsBrazilianPhone } from '@/shared/common/validators/is-brazilian-phone.validator'

export class CreateUserDto {
  @ApiProperty({
    description: 'User name',
    minLength: 2,
    maxLength: 50,
    type: String,
    example: 'John Doe',
    required: true
  })
  @IsString({ message: 'Nome deve ser texto.' })
  @Length(2, 50, { message: 'Nome deve ter entre 2 e 50 caracteres.' })
  @IsNotEmpty({ message: 'Nome e obrigatorio.' })
  name: string

  @ApiProperty({
    description: 'User last name',
    minLength: 2,
    maxLength: 50,
    type: String,
    example: 'Jones',
    required: true
  })
  @IsString({ message: 'Sobrenome deve ser texto.' })
  @Length(2, 50, { message: 'Sobrenome deve ter entre 2 e 50 caracteres.' })
  @IsNotEmpty({ message: 'Sobrenome e obrigatorio.' })
  surname: string

  @ApiProperty({
    description: 'User phone number',
    example: '+55(11)99999-9999',
    type: String,
    required: true
  })
  @IsString({ message: 'Telefone deve ser texto.' })
  @IsBrazilianPhone()
  @IsNotEmpty({ message: 'Telefone e obrigatorio.' })
  phone: string

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    type: String,
    required: true
  })
  @IsEmail({}, { message: 'Informe um email valido.' })
  @IsNotEmpty({ message: 'Email e obrigatorio.' })
  email: string

  @ApiProperty({
    description: 'User password',
    minLength: 8,
    example: 'Password@123',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  password: string

  @ApiProperty({
    description: 'Street address',
    example: '123 Main St',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  street: string

  @ApiProperty({
    description: 'Address number',
    example: 123,
    type: Number,
    required: true
  })
  @IsNumber()
  @IsNotEmpty()
  number: number

  @ApiProperty({
    description: 'Address complement',
    required: false,
    example: 'Apt 101',
    type: String,
    nullable: true
  })
  @IsString()
  @IsOptional()
  complement?: string

  @ApiProperty({
    description: 'Neighborhood',
    example: 'Center',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @ApiProperty({
    description: 'City',
    example: 'São Paulo',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  city: string

  @ApiProperty({
    description: 'Federative unit',
    enum: FederativeUnit,
    example: FederativeUnit.SP,
    enumName: 'FederativeUnit',
    required: true
  })
  @IsEnum(FederativeUnit)
  @IsNotEmpty()
  federativeUnit: FederativeUnit

  @ApiProperty({
    description: 'Postal code',
    example: '01234567',
    type: String,
    required: true
  })
  @IsString()
  @IsNotEmpty()
  postalCode: string

  @ApiProperty({
    description: 'Country',
    enum: Country,
    example: Country.BRAZIL,
    enumName: 'Country',
    required: true
  })
  @IsString()
  @IsNotEmpty()
  country: Country
}
