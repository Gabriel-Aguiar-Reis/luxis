import { Injectable, Inject } from '@nestjs/common'
import { CreateSupplierUseCase } from '@/modules/supplier/application/use-cases/create-supplier.use-case'
import { CreateSupplierDto } from '@/modules/supplier/application/dtos/create-supplier.dto'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { UUID } from 'crypto'

@Injectable()
export class SupplierSeed {
  constructor(
    private readonly createSupplierUseCase: CreateSupplierUseCase,
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async run(): Promise<UUID[]> {
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
    const existing = await this.supplierRepository.findAll()
    const createdIds: UUID[] = []
    for (const dto of suppliers) {
      const found = existing.find((s) => s.name.getValue() === dto.name)
      if (found) {
        createdIds.push(found.id)
      } else {
        const supplier = await this.createSupplierUseCase.execute(dto)
        createdIds.push(supplier.id)
      }
    }
    return createdIds
  }
}
