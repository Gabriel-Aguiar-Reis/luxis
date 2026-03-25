import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsString } from 'class-validator'

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'Email do usuário',
    example: 'user@example.com'
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string
}
