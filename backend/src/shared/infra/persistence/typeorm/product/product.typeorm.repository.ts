import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository, In } from 'typeorm'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductMapper } from '@/shared/infra/persistence/typeorm/product/mappers/product.mapper'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { UUID } from 'crypto'

@Injectable()
export class ProductTypeOrmRepository implements ProductRepository {
  constructor(
    @InjectRepository(ProductTypeOrmEntity)
    private readonly repository: Repository<ProductTypeOrmEntity>
  ) {}

  async findAll(): Promise<Product[]> {
    const entities = await this.repository.find({
      order: { serialNumber: 'ASC' }
    })
    return entities.map(ProductMapper.toDomain)
  }

  async findById(id: UUID): Promise<Product | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return ProductMapper.toDomain(entity)
  }

  async findManyByIds(
    ids: UUID[],
    status?: ProductStatus[]
  ): Promise<Product[]> {
    const entities = await this.repository.findBy({
      id: In(ids),
      status: status ? In(status) : undefined
    })
    return entities.map(ProductMapper.toDomain)
  }

  async findByBatchId(batchId: UUID): Promise<Product[]> {
    const entities = await this.repository.find({ where: { batchId } })
    return entities.map(ProductMapper.toDomain)
  }

  async create(product: Product): Promise<Product> {
    const entity = ProductMapper.toTypeOrm(product)
    const savedEntity = await this.repository.save(entity)
    return ProductMapper.toDomain(savedEntity)
  }

  async update(product: Product): Promise<Product> {
    const entity = await this.repository.findOne({ where: { id: product.id } })
    if (!entity) throw new NotFoundException('Product not found')
    const updatedEntity = await this.repository.save(
      ProductMapper.toTypeOrm(product)
    )
    return ProductMapper.toDomain(updatedEntity)
  }

  async updateStatus(id: UUID, status: ProductStatus): Promise<Product> {
    await this.repository.update(id, { status })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity) throw new NotFoundException('Product not found')
    return ProductMapper.toDomain(updatedEntity)
  }

  async updateManyStatus(ids: UUID[], status: ProductStatus): Promise<void> {
    await this.repository.update({ id: In(ids) }, { status })
    const updatedEntities = await this.repository.findBy({ id: In(ids) })
    if (updatedEntities.length !== ids.length) {
      throw new NotFoundException('Some products not found')
    }
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
