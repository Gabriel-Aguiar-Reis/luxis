import { Injectable, Inject } from '@nestjs/common'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { CreateCustomerDto } from '@/modules/customer/application/dtos/create-customer.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import * as crypto from 'crypto'

@Injectable()
export class CustomerSeed {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  async run(): Promise<string[]> {
    const adminUser: UserPayload = {
      id: crypto.randomUUID(),
      email: 'admin@seed.com',
      role: Role.ADMIN,
      status: UserStatus.ACTIVE
    }

    const customers: CreateCustomerDto[] = [
      {
        name: 'Maria da Silva',
        phone: '11977777777'
      },
      {
        name: 'João dos Santos',
        phone: '11966666666'
      }
    ]

    const createdIds: string[] = []
    for (const dto of customers) {
      const customer = await this.createCustomerUseCase.execute(dto, adminUser)
      createdIds.push(customer.id)
    }
    return createdIds
  }
}
