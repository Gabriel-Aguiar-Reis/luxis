import { ApiProperty } from '@nestjs/swagger'
import { Email } from '@/shared/common/value-object/email.vo'
import { IsEmail, IsNotEmpty } from 'class-validator'

export class RequestPasswordResetDto {
  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
    type: Email,
    required: true
  })
  @IsEmail()
  @IsNotEmpty()
  email: string
}
