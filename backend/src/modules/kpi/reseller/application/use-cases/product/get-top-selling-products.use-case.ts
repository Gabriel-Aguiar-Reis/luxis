import { Inject, Injectable } from '@nestjs/common'
import { UUID } from 'crypto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'
import { ProductReadRepository } from '@/modules/kpi/reseller/domain/repositories/product-read.repository'
import { SellingProductDto } from '@/modules/kpi/reseller/application/dtos/product/selling-product.dto'

@Injectable()
export class GetTopSellingProductsUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(
    resellerId: UUID,
    qParams: ParamsDto
  ): Promise<SellingProductDto[]> {
    return this.productReadRepository.topSellingProducts(resellerId, qParams)
  }
}
