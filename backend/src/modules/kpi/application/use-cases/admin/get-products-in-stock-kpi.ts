import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/domain/repositories/product-read.repository'
import { ProductInStockDto } from '@/modules/kpi/application/dtos/product-in-stock.dto'

@Injectable()
export class GetProductsInStockUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(): Promise<ProductInStockDto[]> {
    return await this.productReadRepository.productsInStock()
  }
}
