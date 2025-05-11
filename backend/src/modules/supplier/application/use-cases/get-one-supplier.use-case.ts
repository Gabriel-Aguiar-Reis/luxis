import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { UUID } from 'crypto'

@Injectable()
export class GetOneSupplierUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(id: UUID): Promise<Supplier> {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) {
      throw new NotFoundException('Supplier not found')
    }
    return supplier
  }
}
