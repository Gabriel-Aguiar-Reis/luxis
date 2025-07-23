import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The new status for the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    enumName: 'UserStatus',
    required: true
  })
  status: UserStatus
}
