import { User } from '@/modules/user/domain/entities/user.entity'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { Address } from '@/modules/user/domain/value-objects/address.vo'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Residence } from '@/modules/user/domain/value-objects/residence.vo'
import { UpdateUserDto } from '@/modules/user/presentation/dtos/update-user.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateUserUseCase {
  constructor(
    @Inject('UserRepository')
    private readonly userRepo: UserRepository
  ) {}

  async execute(
    id: UUID,
    input: UpdateUserDto,
    user: UserPayload
  ): Promise<User> {
    let userData = await this.userRepo.findById(id)
    if (!userData) {
      throw new NotFoundException('User not found')
    }

    if (user.role === Role.RESELLER && user.id !== userData.id) {
      throw new UnauthorizedException(
        'You do not have permission to perform this action'
      )
    }

    const address = new Address(
      input.street ?? userData.residence.address.street,
      input.number ?? userData.residence.address.number,
      input.neighborhood ?? userData.residence.address.neighborhood,
      input.city ?? userData.residence.address.city,
      input.federativeUnit ?? userData.residence.address.federativeUnit,
      input.postalCode ?? userData.residence.address.postalCode,
      input.country ?? userData.residence.address.country,
      input.complement ?? userData.residence.address.complement
    )

    const residence = new Residence(address)
    userData! = new User(
      id,
      input.name ?? userData.name,
      input.surName ?? userData.surName,
      input.phone ?? userData.phone,
      input.email ?? userData.email,
      input.password
        ? PasswordHash.generate(input.password)
        : userData.passwordHash,
      userData.role,
      residence ?? userData.residence,
      userData.status
    )
    return await this.userRepo.update(userData)
  }
}
