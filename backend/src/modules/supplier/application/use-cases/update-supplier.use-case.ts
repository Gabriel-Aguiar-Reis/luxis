import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { UpdateSupplierDto } from '@/modules/supplier/presentation/dtos/update-supplier.dto'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { UUID } from 'crypto'

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
      dto.name ? new Name(dto.name.getValue()) : existingSupplier.name,
      dto.phone ? new PhoneNumber(dto.phone.getValue()) : existingSupplier.phone
    )

    return await this.supplierRepository.update(id, updatedSupplier)
  }
}
