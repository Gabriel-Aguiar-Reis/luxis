import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductReadRepository } from '@/modules/kpi/reseller/domain/repositories/product-read.repository'
import { ProductInInventoryDto } from '@/modules/kpi/reseller/application/dtos/product/product-in-inventory.dto'

@Injectable()
export class GetProductsWithLongestTimeInInventoryUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<ProductInInventoryDto[]> {
    return this.productReadRepository.productsWithLongestTimeInInventory(
      resellerId,
      qParams
    )
  }
}
