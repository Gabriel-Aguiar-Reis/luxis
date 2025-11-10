import { CreateSupplierDto } from '@/modules/supplier/application/dtos/create-supplier.dto'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Inject, Injectable } from '@nestjs/common'
import { SupplierName } from '@/modules/supplier/domain/value-objects/supplier-name.vo'

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = new Supplier(
      crypto.randomUUID(),
      new SupplierName(dto.name),
      new PhoneNumber(dto.phone)
    )

    return await this.supplierRepository.create(supplier)
  }
}
