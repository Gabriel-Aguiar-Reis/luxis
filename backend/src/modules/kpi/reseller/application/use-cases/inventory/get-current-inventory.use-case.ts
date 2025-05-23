import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { InventoryReadRepository } from '@/modules/kpi/reseller/domain/repositories/inventory-read.repository'
import { InventoryProductModelDto } from '@/modules/kpi/reseller/application/dtos/inventory/inventory-product-model.dto'

@Injectable()
export class GetCurrentInventoryUseCase {
  constructor(
    @Inject('InventoryReadRepository')
    private readonly inventoryReadRepository: InventoryReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<InventoryProductModelDto[]> {
    return this.inventoryReadRepository.currentInventory(resellerId, qParams)
  }
}
