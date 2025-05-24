import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { User } from '@/modules/user/domain/entities/user.entity'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UpdateUserRoleDto } from '@/modules/user/application/dtos/update-user-role.dto'
@Injectable()
export class UpdateUserRoleUseCase {
  constructor(
    @Inject('UserRepository') private readonly userRepo: UserRepository
  ) {}

  async execute(
    id: UUID,
    dto: UpdateUserRoleDto,
    user: UserPayload
  ): Promise<User> {
    let userData = await this.userRepo.findById(id)
    if (!userData) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.RESELLER) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action'
      )
    }

    if (dto.role === Role.UNASSIGNED) {
      throw new BadRequestException('Unassigned role is not allowed')
    }

    if (dto.status === UserStatus.ACTIVE) {
      return await this.userRepo.updateRole(id, dto.role, dto.status)
    }

    return await this.userRepo.updateRole(id, dto.role)
  }
}
