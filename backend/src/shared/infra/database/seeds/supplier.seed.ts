import { Injectable, Inject } from '@nestjs/common'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { CreateSupplierDto } from '@/modules/supplier/application/dtos/create-supplier.dto'

@Injectable()
export class SupplierSeed {
  constructor(private readonly createSupplierUseCase: CreateSupplierUseCase) {}

  async run(): Promise<string[]> {
    const suppliers: CreateSupplierDto[] = [
      {
        name: 'Fornecedor Luxis',
        phone: '11999999999'
      },
      {
        name: 'Fornecedor Premium',
        phone: '11988888888'
      }
    ]
    const createdIds: string[] = []
    for (const dto of suppliers) {
      const supplier = await this.createSupplierUseCase.execute(dto)
      createdIds.push(supplier.id)
    }
    return createdIds
  }
}
