import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    type: Email,
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: Email

  @ApiProperty({
    description: 'The password of the user',
    example: 'password',
    type: Password,
    required: true
  })
  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: Password
}
