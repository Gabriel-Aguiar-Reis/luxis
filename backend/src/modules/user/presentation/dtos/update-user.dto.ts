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

export class UpdateUserDto {
  @IsString()
  @Length(2, 50)
  @IsOptional()
  name: Name

  @IsString()
  @Length(2, 50)
  @IsOptional()
  surName: Name

  @IsString()
  @IsOptional()
  phone: PhoneNumber

  @IsEmail()
  @IsOptional()
  email: Email

  @IsString()
  @IsOptional()
  password: Password

  @IsString()
  @IsOptional()
  street: string

  @IsNumber()
  @IsOptional()
  number: number

  @IsString()
  @IsOptional()
  complement: string

  @IsString()
  @IsOptional()
  neighborhood: string

  @IsString()
  @IsOptional()
  city: string

  @IsEnum(FederativeUnit)
  @IsOptional()
  federativeUnit: FederativeUnit

  @IsString()
  @IsOptional()
  postalCode: PostalCode

  @IsString()
  @IsOptional()
  country: Country
}
