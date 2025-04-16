export class ProductModel {
  constructor(
    public readonly id: string,
    public name: string,
    public category: string,
    public description?: string
  ) {}
}
