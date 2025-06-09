import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { Injectable, Inject } from '@nestjs/common'
import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { CreateUserDto } from '@/modules/user/application/dtos/create-user.dto'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'

@Injectable()
export class ResellerSeed {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserRoleUseCase: UpdateUserRoleUseCase
  ) {}

  async run(userPayload: UserPayload): Promise<UUID[]> {
    const dto: CreateUserDto = {
      name: 'Reseller',
      surname: 'Luxis',
      email: 'reseller@luxis.com',
      phone: '11912345678',
      password: 'Reseller*123',
      street: 'Rua do Reseller',
      number: 10,
      neighborhood: 'Centro',
      city: 'São Paulo',
      federativeUnit: FederativeUnit.SP,
      postalCode: '01002000',
      country: Country.BRAZIL,
      complement: 'Apto 101'
    }
    const dto2: CreateUserDto = {
      name: 'Reseller',
      surname: 'Luxis Segundo',
      email: 'reseller2@luxis.com',
      phone: '11912345679',
      password: 'Reseller*123',
      street: 'Rua do Reseller 2',
      number: 20,
      neighborhood: 'Centro',
      city: 'São Paulo',
      federativeUnit: FederativeUnit.SP,
      postalCode: '01002001',
      country: Country.BRAZIL,
      complement: 'Apto 102'
    }
    const resellerIds: UUID[] = []
    for (const d of [dto, dto2]) {
      const user = await this.createUserUseCase.execute(d)
      await this.updateUserRoleUseCase.execute(
        user.id,
        { role: Role.RESELLER, status: UserStatus.ACTIVE },
        userPayload
      )
      resellerIds.push(user.id)
    }
    return resellerIds
  }
}
