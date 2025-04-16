import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.orm-entity'
import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
@Injectable()
export class ProductRepositoryImpl implements ProductRepository {
  constructor(
    @InjectRepository(ProductRepository)
    private readonly repo: Repository<ProductModelOrmEntity>
  ) {}

  findAll(): Promise<Product[]> {
    throw new Error('Method not implemented.')
  }
  findById(id: string): Promise<Product | null> {
    throw new Error('Method not implemented.')
  }
  create(product: Product): Promise<Product> {
    throw new Error('Method not implemented.')
  }
  update(product: Product): Promise<Product> {
    throw new Error('Method not implemented.')
  }
  updateStatus(id: string, status: string): Promise<Product> {
    throw new Error('Method not implemented.')
  }
  delete(id: string): Promise<void> {
    throw new Error('Method not implemented.')
  }
}
