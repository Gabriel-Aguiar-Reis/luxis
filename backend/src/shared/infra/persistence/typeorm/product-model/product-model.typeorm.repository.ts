import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { ProductModelMapper } from '@/shared/infra/persistence/typeorm/product-model/mappers/product-model.mapper'
import { UUID } from 'crypto'

@Injectable()
export class ProductModelTypeOrmRepository implements ProductModelRepository {
  constructor(
    @InjectRepository(ProductModelTypeOrmEntity)
    private readonly repository: Repository<ProductModelTypeOrmEntity>
  ) {}

  async findAll(): Promise<ProductModel[]> {
    const entities = await this.repository.find()
    return entities.map(ProductModelMapper.toDomain)
  }

  async findAllByResellerId(resellerId: UUID): Promise<ProductModel[]> {
    const entities = await this.repository.find({ where: { resellerId } })
    return entities.map(ProductModelMapper.toDomain)
  }

  async findById(id: UUID): Promise<ProductModel | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return ProductModelMapper.toDomain(entity)
  }

  async create(model: ProductModel): Promise<ProductModel> {
    const entity = ProductModelMapper.toTypeOrm(model)
    const savedEntity = await this.repository.save(entity)
    return ProductModelMapper.toDomain(savedEntity)
  }

  async update(model: ProductModel): Promise<ProductModel> {
    const entity = ProductModelMapper.toTypeOrm(model)
    const updatedEntity = await this.repository.save(entity)
    return ProductModelMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
