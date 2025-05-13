import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/domain/repositories/product-read.repository'

@Injectable()
export class GetTotalProductWithResellersUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(): Promise<number> {
    return await this.productReadRepository.totalProductsWithResellers()
  }
}
