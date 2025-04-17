export class ProductModel {
  constructor(
    public readonly id: string,
    public name: string,
    public categoryId: string,
    public description?: string
  ) {}
}
