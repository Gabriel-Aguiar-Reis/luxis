import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetProductsInStockUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<ProductInStockDto[]> {
    return await this.productReadRepository.productsInStock(qParams)
  }
}
