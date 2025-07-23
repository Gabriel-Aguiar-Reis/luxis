import { Injectable } from '@nestjs/common'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { CreateCustomerDto } from '@/modules/customer/application/dtos/create-customer.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import * as crypto from 'crypto'

@Injectable()
export class CustomerSeed {
  constructor(private readonly createCustomerUseCase: CreateCustomerUseCase) {}

  async run(user: UserPayload): Promise<crypto.UUID[]> {
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

    const createdIds: crypto.UUID[] = []
    for (const dto of customers) {
      const customer = await this.createCustomerUseCase.execute(dto, user)
      createdIds.push(customer.id)
    }
    return createdIds
  }
}
