import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductWithResellerDto } from '@/modules/kpi/admin/application/dtos/product/product-with-reseller.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetProductsWithResellerUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<ProductWithResellerDto[]> {
    return await this.productReadRepository.productsWithResellers(qParams)
  }
}
