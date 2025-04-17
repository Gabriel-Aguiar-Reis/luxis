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
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Email } from '@/modules/user/domain/value-objects/email.vo'
import { PostalCode } from '@/modules/user/domain/value-objects/postal-code.vo'
import { Country } from '@/modules/user/domain/enums/country.enum'

export class CreateUserDto {
  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  name: Name

  @IsString()
  @Length(2, 50)
  @IsNotEmpty()
  surName: Name

  @IsString()
  @IsNotEmpty()
  phone: PhoneNumber

  @IsEmail()
  @IsNotEmpty()
  email: Email

  @IsString()
  @IsNotEmpty()
  password: string

  @IsEnum(Role)
  @IsNotEmpty()
  role: Role

  @IsString()
  @IsNotEmpty()
  street: string

  @IsNumber()
  @IsNotEmpty()
  number: number

  @IsString()
  @IsOptional()
  complement: string

  @IsString()
  @IsNotEmpty()
  neighborhood: string

  @IsString()
  @IsNotEmpty()
  city: string

  @IsEnum(FederativeUnit)
  @IsNotEmpty()
  federativeUnit: FederativeUnit

  @IsString()
  @IsNotEmpty()
  postalCode: PostalCode

  @IsString()
  @IsNotEmpty()
  country: Country
}
