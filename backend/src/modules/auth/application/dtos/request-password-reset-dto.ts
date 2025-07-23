import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    type: String,
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
