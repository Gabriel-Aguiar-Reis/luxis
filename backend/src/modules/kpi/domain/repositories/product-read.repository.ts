import { ProductInStockDto } from '@/modules/kpi/application/dtos/product-in-stock.dto'

export abstract class ProductReadRepository {
  abstract totalProductsInStock(): Promise<number>
  abstract totalProductsWithResellers(): Promise<number>
  abstract productsInStock(): Promise<ProductInStockDto[]>
}
