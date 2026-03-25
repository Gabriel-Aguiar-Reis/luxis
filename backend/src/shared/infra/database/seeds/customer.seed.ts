import { Injectable, Inject } from '@nestjs/common'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { CreateCustomerDto } from '@/modules/customer/application/dtos/create-customer.dto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import * as crypto from 'crypto'

@Injectable()
export class CustomerSeed {
  constructor(
    private readonly createCustomerUseCase: CreateCustomerUseCase,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository
  ) {}

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

    const existing = await this.customerRepository.findAll()
    const createdIds: crypto.UUID[] = []
    for (const dto of customers) {
      const found = existing.find((c) => c.phone.getValue() === dto.phone)
      if (found) {
        createdIds.push(found.id)
      } else {
        const customer = await this.createCustomerUseCase.execute(dto, user)
        createdIds.push(customer.id)
      }
    }
    return createdIds
  }
}
