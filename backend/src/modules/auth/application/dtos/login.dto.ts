import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  Matches
} from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class LoginDto {
  @ApiProperty({
    description: 'The email of the user',
    example: 'test@test.com',
    type: String,
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string

  @ApiProperty({
    description:
      'The password of the user. Must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Test@123456',
    type: String,
    required: true
  })
  @IsString()
  @MinLength(10)
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
    {
      message:
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character'
    }
  )
  @IsNotEmpty()
  password: string
}
