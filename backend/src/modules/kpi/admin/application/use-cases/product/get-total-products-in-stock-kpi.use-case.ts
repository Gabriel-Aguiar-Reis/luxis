import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/admin/domain/repositories/product-read.repository'

@Injectable()
export class GetTotalProductsInStockUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(): Promise<number> {
    return await this.productReadRepository.totalProductsInStock()
  }
}
