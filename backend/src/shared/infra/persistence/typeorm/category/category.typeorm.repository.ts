import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Category } from '@/modules/category/domain/entities/category.entity'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { CategoryMapper } from '@/shared/infra/persistence/typeorm/category/mappers/category.mapper'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { UUID } from 'crypto'

@Injectable()
export class CategoryTypeOrmRepository implements CategoryRepository {
  constructor(
    @InjectRepository(CategoryTypeOrmEntity)
    private readonly repository: Repository<CategoryTypeOrmEntity>
  ) {}

  async findAll(): Promise<Category[]> {
    const entities = await this.repository.find()
    return entities.map(CategoryMapper.toDomain)
  }

  async findById(id: UUID): Promise<Category | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return CategoryMapper.toDomain(entity)
  }

  async create(category: Category): Promise<Category> {
    const entity = CategoryMapper.toTypeOrm(category)
    const savedEntity = await this.repository.save(entity)
    return CategoryMapper.toDomain(savedEntity)
  }

  async update(category: Category): Promise<Category> {
    const entity = CategoryMapper.toTypeOrm(category)
    const updatedEntity = await this.repository.save(entity)
    return CategoryMapper.toDomain(updatedEntity)
  }

  async updateStatus(id: UUID, status: CategoryStatus): Promise<Category> {
    await this.repository.update(id, { status })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity) throw new Error('Category not found')
    return CategoryMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
