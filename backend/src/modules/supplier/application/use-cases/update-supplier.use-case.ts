import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { UpdateSupplierDto } from '@/modules/supplier/application/dtos/update-supplier.dto'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { UUID } from 'crypto'
import { SupplierName } from '@/modules/supplier/domain/value-objects/supplier-name.vo'

@Injectable()
export class UpdateSupplierUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(id: UUID, dto: UpdateSupplierDto): Promise<Supplier> {
    const existingSupplier = await this.supplierRepository.findById(id)
    if (!existingSupplier) {
      throw new NotFoundException('Supplier not found')
    }

    const updatedSupplier = new Supplier(
      id,
      dto.name ? new SupplierName(dto.name) : existingSupplier.name,
      dto.phone ? new PhoneNumber(dto.phone) : existingSupplier.phone
    )

    return await this.supplierRepository.update(id, updatedSupplier)
  }
}
