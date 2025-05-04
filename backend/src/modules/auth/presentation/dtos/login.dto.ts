import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: Email

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: Password
}
