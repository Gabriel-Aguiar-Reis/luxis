import { ApiProperty } from '@nestjs/swagger'
import { PasswordResetRequestStatus } from '@/modules/auth/domain/enums/password-reset-request-status.enum'
import { Email } from '@/shared/common/value-object/email.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'

export class PasswordResetRequestResponseDto {
  @ApiProperty()
  id: string

  @ApiProperty()
  userId: string

  @ApiProperty()
  username: string

  @ApiProperty({ type: Email })
  email: Email

  @ApiProperty({ type: PhoneNumber })
  phone: PhoneNumber

  @ApiProperty()
  token: string

  @ApiProperty({ enum: PasswordResetRequestStatus })
  status: PasswordResetRequestStatus

  @ApiProperty()
  createdAt: Date

  @ApiProperty({ required: false })
  approvedAt?: Date

  @ApiProperty({ required: false })
  rejectedAt?: Date

  @ApiProperty({ required: false })
  completedAt?: Date

  @ApiProperty({ required: false })
  user?: {
    id: string
    name: string
    surname: string
    email: string
    phone: string
  }
}
