import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { ReturnTypeOrmMapper } from '@/shared/infra/persistence/typeorm/return/mappers/return.typeorm.mapper'
import { UUID } from 'crypto'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'

@Injectable()
export class ReturnTypeOrmRepository implements ReturnRepository {
  constructor(
    @InjectRepository(ReturnTypeOrmEntity)
    private readonly repository: Repository<ReturnTypeOrmEntity>
  ) {}

  async findByResellerId(resellerId: UUID): Promise<Return[]> {
    const returns = await this.repository.find({ where: { resellerId } })
    return returns.map(ReturnTypeOrmMapper.toDomain)
  }

  async updateStatus(id: UUID, status: ReturnStatus): Promise<Return> {
    const raw = await this.repository.findOne({ where: { id } })
    if (!raw) throw new Error('Return not found')
    raw.status = status
    await this.repository.save(raw)
    return ReturnTypeOrmMapper.toDomain(raw)
  }

  async create(returnEntity: Return): Promise<Return> {
    const raw = ReturnTypeOrmMapper.toPersistence(returnEntity)
    await this.repository.save(raw)
    return ReturnTypeOrmMapper.toDomain(raw)
  }

  async findAll(): Promise<Return[]> {
    const returns = await this.repository.find()
    return returns.map(ReturnTypeOrmMapper.toDomain)
  }

  async findById(id: UUID): Promise<Return | null> {
    const returnEntity = await this.repository.findOne({ where: { id } })
    if (!returnEntity) return null
    return ReturnTypeOrmMapper.toDomain(returnEntity)
  }

  async update(returnEntity: Return): Promise<Return> {
    const raw = ReturnTypeOrmMapper.toPersistence(returnEntity)
    await this.repository.save(raw)
    return ReturnTypeOrmMapper.toDomain(raw)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
