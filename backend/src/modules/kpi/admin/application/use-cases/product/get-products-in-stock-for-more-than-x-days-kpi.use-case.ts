import { Inject, Injectable } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ProductInStockDto } from '@/modules/kpi/admin/application/dtos/product/product-in-stock.dto'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetProductsInStockForMoreThanXDaysUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepo: ProductReadRepository
  ) {}

  async execute(
    days: number,
    qParams: ParamsDto
  ): Promise<ProductInStockDto[]> {
    return this.productReadRepo.productsInStockForMoreThanXDays(days, qParams)
  }
}
