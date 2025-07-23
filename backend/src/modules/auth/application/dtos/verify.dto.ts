import { UserPayloadDto } from '@/modules/auth/application/dtos/user-payload.dto'
import { ApiProperty } from '@nestjs/swagger'

export class VerifyDto {
  @ApiProperty({
    description: 'The verification token',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: Boolean,
    required: true
  })
  public valid: boolean

  @ApiProperty({
    description: 'The user payload containing user details',
    type: UserPayloadDto,
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.doe@example.com',
      role: 'ADMIN',
      status: 'ACTIVE',
      name: 'John Doe'
    }
  })
  public user: UserPayloadDto
}
