import { Injectable, Inject } from '@nestjs/common'
import { ProductReadRepository } from '@/modules/kpi/domain/repositories/product-read.repository'
import { ProductWithResellerDto } from '@/modules/kpi/application/dtos/product-with-reseller.dto'

@Injectable()
export class GetProductsWithResellerUseCase {
  constructor(
    @Inject('ProductReadRepository')
    private readonly productReadRepository: ProductReadRepository
  ) {}

  async execute(): Promise<ProductWithResellerDto[]> {
    return await this.productReadRepository.productsWithResellers()
  }
}
