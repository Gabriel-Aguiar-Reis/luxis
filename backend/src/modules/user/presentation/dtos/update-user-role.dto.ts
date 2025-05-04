import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { IsEnum, IsNotEmpty, IsOptional } from 'class-validator'

export class UpdateUserRoleDto {
  @IsEnum(Role)
  @IsNotEmpty()
  role: Role

  @IsEnum(UserStatus)
  @IsOptional()
  status?: UserStatus
}
