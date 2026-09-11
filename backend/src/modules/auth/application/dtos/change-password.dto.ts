import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ChangePasswordDto {
  @ApiProperty({
    description:
      'New password (must contain at least 10 characters, one uppercase, one lowercase, one number and one special character)',
    example: 'NewPassword123!',
    minLength: 10
  })
  @IsString({ message: 'Nova senha deve ser texto.' })
  @IsNotEmpty({ message: 'Nova senha e obrigatoria.' })
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
    {
      message:
        'Senha deve ter pelo menos 10 caracteres e conter 1 letra maiuscula, 1 minuscula, 1 numero e 1 caractere especial.'
    }
  )
  newPassword!: string
}
