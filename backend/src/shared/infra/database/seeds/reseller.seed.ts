import { Injectable, Inject } from '@nestjs/common'
import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { CreateUserDto } from '@/modules/user/application/dtos/create-user.dto'
import { FederativeUnit } from '@/modules/user/domain/enums/federative-unit.enum'
import { Country } from '@/modules/user/domain/enums/country.enum'
import { UUID } from 'crypto'

@Injectable()
export class ResellerSeed {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  async run(): Promise<UUID> {
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
    const user = await this.createUserUseCase.execute(dto)
    return user.id
  }
}
