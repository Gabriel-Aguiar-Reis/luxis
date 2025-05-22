import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetTotalProductsInStockUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(qParams: ParamsDto): Promise<number> {
    return await this.productReadRepository.totalProductsInStock(qParams)
  }
}
