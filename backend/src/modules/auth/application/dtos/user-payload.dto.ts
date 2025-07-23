import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ApiProperty } from '@nestjs/swagger'
import { IsEmail, IsEnum, IsString, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class UserPayloadDto implements UserPayload {
  @ApiProperty({
    description: 'The unique identifier of the user',
    example: '123e4567-e89b-12d3-a456-426614174000',
    type: String,
    required: true
  })
  @IsUUID()
  id: UUID

  @ApiProperty({
    description: 'The email address of the user',
    example: 'john.doe@example.com',
    type: String,
    required: true
  })
  @IsEmail()
  email: string

  @ApiProperty({
    description: 'The role of the user',
    example: 'ADMIN',
    enum: Role,
    enumName: 'Role',
    isArray: false,
    default: Role.ADMIN,
    type: String,
    required: true
  })
  @IsEnum(Role)
  role: Role

  @ApiProperty({
    description: 'The status of the user',
    example: 'ACTIVE',
    enum: UserStatus,
    enumName: 'UserStatus',
    isArray: false,
    default: UserStatus.ACTIVE,
    type: String,
    required: true
  })
  @IsEnum(UserStatus)
  status: UserStatus

  @ApiProperty({
    description: 'The name of the user',
    example: 'John Doe',
    type: String,
    required: true
  })
  @IsString()
  name: string
}
