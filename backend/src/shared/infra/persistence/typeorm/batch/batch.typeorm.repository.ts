import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Between, Repository } from 'typeorm'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { BatchRepository } from '@/modules/batch/domain/repositories/batch.repository'
import { UUID } from 'crypto'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { BatchMapper } from '@/shared/infra/persistence/typeorm/batch/mappers/batch.mapper'

@Injectable()
export class BatchTypeOrmRepository implements BatchRepository {
  constructor(
    @InjectRepository(BatchTypeOrmEntity)
    private readonly repository: Repository<BatchTypeOrmEntity>
  ) {}

  async findAllByMonthAndYear(month: number, year: number): Promise<Batch[]> {
    const startDate = new Date(year, month - 1, 1)
    const endDate = new Date(year, month, 0)

    const entities = await this.repository.find({
      where: {
        arrivalDate: Between(startDate, endDate)
      }
    })
    return entities.map(BatchMapper.toDomain)
  }

  async create(batch: Batch): Promise<Batch> {
    const entity = BatchMapper.toTypeOrm(batch)
    const savedEntity = await this.repository.save(entity)
    return BatchMapper.toDomain(savedEntity)
  }

  async findById(id: UUID): Promise<Batch | null> {
    const entity = await this.repository.findOne({
      where: { id }
    })
    if (!entity) return null
    return BatchMapper.toDomain(entity)
  }

  async findAll(): Promise<Batch[]> {
    const entities = await this.repository.find()
    return entities.map(BatchMapper.toDomain)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
