import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'
import { ApiProperty } from '@nestjs/swagger'

export class UpdateUserRoleDto {
  @ApiProperty({
    description: 'The new role for the user',
    enum: Role,
    example: Role.ADMIN,
    type: Role,
    enumName: 'Role',
    required: true
  })
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role

  @ApiProperty({
    description: 'The new status for the user',
    enum: UserStatus,
    example: UserStatus.ACTIVE,
    type: UserStatus,
    enumName: 'UserStatus',
    required: false
  })
  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus
}
