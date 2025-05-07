import { CreateSupplierDto } from '@/modules/supplier/presentation/dtos/create-supplier.dto'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { SupplierRepository } from '@/modules/supplier/domain/repositories/supplier.repository'
import { PhoneNumber } from '@/modules/user/domain/value-objects/phone-number.vo'
import { Name } from '@/modules/user/domain/value-objects/name.vo'
import { Inject, Injectable } from '@nestjs/common'

@Injectable()
export class CreateSupplierUseCase {
  constructor(
    @Inject('SupplierRepository')
    private readonly supplierRepository: SupplierRepository
  ) {}

  async execute(dto: CreateSupplierDto): Promise<Supplier> {
    const supplier = new Supplier(
      crypto.randomUUID(),
      new Name(dto.name),
      new PhoneNumber(dto.phone)
    )

    return await this.supplierRepository.create(supplier)
  }
}
