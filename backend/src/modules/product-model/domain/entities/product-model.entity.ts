import { UUID } from 'crypto'

export class ProductModel {
  constructor(
    public readonly id: UUID,
    public name: string,
    public categoryId: UUID,
    public description?: string
  ) {}
}
