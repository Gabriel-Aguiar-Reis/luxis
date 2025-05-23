import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { UUID } from 'crypto'
import { InventoryProductModelDto } from '@/modules/kpi/reseller/application/dtos/inventory/inventory-product-model.dto'

export abstract class InventoryReadRepository {
  abstract currentInventory(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<InventoryProductModelDto[]>
}
