import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { UUID } from 'crypto'

@Injectable()
export class DeleteSupplierUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    const supplier = await this.supplierRepository.findById(id)
    if (!supplier) {
      throw new NotFoundException('Supplier not found')
    }

    await this.supplierRepository.delete(id)
  }
}
