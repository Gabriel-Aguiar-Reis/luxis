import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ApiProperty } from '@nestjs/swagger'
import { UUID } from 'crypto'

export class VerifyDto {
  @ApiProperty({
    description: 'The verification token',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  public valid: boolean

  @ApiProperty({
    description: 'The user payload containing user details',
    type: Object,
    required: true,
    example: {
      id: '123e4567-e89b-12d3-a456-426614174000',
      email: 'john.doe@example.com',
      role: 'user',
      status: 'active',
      name: 'John Doe'
    }
  })
  public user: UserPayload
}
