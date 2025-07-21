import { IsNotEmpty, IsString, IsUUID, Matches } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class ChangePasswordDto {
  @ApiProperty({
    description: 'User ID for whom the password is being changed',
    example: '123e4567-e89b-12d3-a456-426614174000'
  })
  @IsUUID()
  @IsNotEmpty()
  userId: UUID

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