import { Inject, Injectable } from '@nestjs/common'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'

@Injectable()
export class GetAllSuppliersUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(): Promise<Supplier[]> {
    return await this.supplierRepository.findAll()
  }
}
