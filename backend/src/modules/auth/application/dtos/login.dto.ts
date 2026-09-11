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
  @IsEmail({}, { message: 'Informe um email valido.' })
  @IsNotEmpty({ message: 'Email e obrigatorio.' })
  email!: string

  @ApiProperty({
    description:
      'The password of the user. Must contain at least 10 characters, one uppercase letter, one lowercase letter, one number and one special character',
    example: 'Test@123456',
    type: String,
    required: true
  })
  @IsString()
  @MinLength(10, { message: 'Senha deve ter pelo menos 10 caracteres.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
    {
      message:
        'Senha deve conter ao menos 1 letra maiuscula, 1 minuscula, 1 numero e 1 caractere especial.'
    }
  )
  @IsNotEmpty({ message: 'Senha e obrigatoria.' })
  password!: string
}
