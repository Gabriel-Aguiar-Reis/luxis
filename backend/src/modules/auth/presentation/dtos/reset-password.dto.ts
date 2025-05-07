import { IsNotEmpty, IsString, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Reset password token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
  })
  @IsString()
  @IsNotEmpty()
  token: string

  @ApiProperty({
    description:
      'New password (must contain at least 10 characters, one uppercase, one lowercase, one number and one special character)',
    example: 'NewPassword123!',
    minLength: 10
  })
  @IsString()
  @IsNotEmpty()
  @Matches(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/,
    {
      message:
        'Password must contain at least 10 characters, one uppercase, one lowercase, one number and one special character'
    }
  )
  newPassword: string
}
