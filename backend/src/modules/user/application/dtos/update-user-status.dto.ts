import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { ApiProperty } from '@nestjs/swagger'
import { IsEnum, IsNotEmpty } from 'class-validator'

export class UpdateUserStatusDto {
  @ApiProperty({
    description: 'The new status for the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    enumName: 'UserStatus',
    required: true
  })
  @IsEnum(UserStatus)
  @IsNotEmpty()
  status: UserStatus
}
