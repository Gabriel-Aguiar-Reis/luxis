import { Injectable } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'
import { ParamsDto } from '@/shared/common/dtos/params.dto'

@Injectable()
export class GetTotalProductsInStockForMoreThanXDaysUseCase {
  constructor(private readonly productReadRepo: ProductReadRepository) {}

  async execute(days: number, qParams: ParamsDto): Promise<number> {
    return this.productReadRepo.totalProductsInStockForMoreThanXDays(
      days,
      qParams
    )
  }
}
