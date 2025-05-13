export abstract class ProductReadRepository {
  abstract totalProductsInStock(): Promise<number>
  abstract totalProductsWithResellers(): Promise<number>
}
