import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Email } from '@/shared/common/value-object/email.vo'
import { ApiProperty } from '@nestjs/swagger'
import { Type } from 'class-transformer'
import { IsEnum, IsNotEmpty, IsUUID } from 'class-validator'
import { UUID } from 'crypto'

export class PasswordResetRequest {
  @ApiProperty({
    description: 'Unique identifier for the password reset request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  id: UUID

  @ApiProperty({
    description:
      'Unique identifier for the user associated with the password reset request',
    type: String,
    example: '550e8400-e29b-41d4-a716-446655440000'
  })
  @IsUUID()
  userId: UUID

  @ApiProperty({
    description: 'Username of the user requesting the password reset',
    type: String,
    example: 'john_doe'
  })
  @IsNotEmpty()
  username: string

  @ApiProperty({
    description: 'Email address of the user requesting the password reset',
    type: Email,
    example: 'john_doe@example.com'
  })
  @IsNotEmpty()
  email: Email

  @ApiProperty({
    description: 'Phone number of the user requesting the password reset',
    type: PhoneNumber,
    example: '+1234567890'
  })
  @IsNotEmpty()
  phone: PhoneNumber

  @ApiProperty({
    description: 'Unique token for the password reset request',
    type: String,
    example: 'reset-token-123456'
  })
  @IsNotEmpty()
  token: string

  @ApiProperty({
    description: 'Current status of the password reset request',
    enum: PasswordResetRequestStatus,
    example: PasswordResetRequestStatus.PENDING
  })
  @IsNotEmpty()
  @IsEnum(PasswordResetRequestStatus)
  status: PasswordResetRequestStatus

  @ApiProperty({
    description: 'Timestamp when the password reset request was created',
    type: Date,
    example: '2024-01-01T12:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  createdAt: Date

  @ApiProperty({
    description: 'Timestamp when the password reset request was approved',
    type: Date,
    example: '2024-01-01T12:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  approvedAt?: Date

  @ApiProperty({
    description: 'Timestamp when the password reset request was rejected',
    type: Date,
    example: '2024-01-01T12:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  rejectedAt?: Date

  @ApiProperty({
    description: 'Timestamp when the password reset request was completed',
    type: Date,
    example: '2024-01-01T12:00:00Z'
  })
  @IsNotEmpty()
  @Type(() => Date)
  completedAt?: Date
}
