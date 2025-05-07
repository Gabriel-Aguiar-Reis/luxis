import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { UUID } from 'crypto'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'

@Injectable()
export class SaleTypeOrmRepository implements SaleRepository {
  constructor(
    @InjectRepository(SaleTypeOrmEntity)
    private readonly repository: Repository<SaleTypeOrmEntity>
  ) {}

  async update(sale: Sale): Promise<Sale> {
    const entity = SaleMapper.toTypeOrm(sale)
    const updatedEntity = await this.repository.save(entity)
    return SaleMapper.toDomain(updatedEntity)
  }

  async create(sale: Sale): Promise<Sale> {
    const entity = SaleMapper.toTypeOrm(sale)
    const savedEntity = await this.repository.save(entity)
    return SaleMapper.toDomain(savedEntity)
  }

  async findById(id: UUID): Promise<Sale | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return SaleMapper.toDomain(entity)
  }

  async findAll(): Promise<Sale[]> {
    const entities = await this.repository.find()
    return entities.map(SaleMapper.toDomain)
  }

  async findByResellerId(resellerId: UUID): Promise<Sale[]> {
    const entities = await this.repository.find({ where: { resellerId } })
    return entities.map(SaleMapper.toDomain)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
