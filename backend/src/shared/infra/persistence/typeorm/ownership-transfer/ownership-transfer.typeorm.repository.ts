import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { OwnershipTransferStatus } from '@/modules/ownership-transfer/domain/enums/ownership-transfer-status.enum'
import { UUID } from 'crypto'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { OwnershipTransferMapper } from '@/shared/infra/persistence/typeorm/ownership-transfer/mappers/ownership-transfer.mapper'

@Injectable()
export class OwnershipTransferTypeOrmRepository
  implements OwnershipTransferRepository
{
  constructor(
    @InjectRepository(OwnershipTransferTypeOrmEntity)
    private readonly repository: Repository<OwnershipTransferTypeOrmEntity>
  ) {}

  async findAllByResellerId(resellerId: UUID): Promise<OwnershipTransfer[]> {
    const entities = await this.repository.find({
      where: { fromResellerId: resellerId, toResellerId: resellerId }
    })
    return entities.map(OwnershipTransferMapper.toDomain)
  }

  async update(
    ownershipTransfer: OwnershipTransfer
  ): Promise<OwnershipTransfer> {
    const entity = OwnershipTransferMapper.toTypeOrm(ownershipTransfer)
    const updatedEntity = await this.repository.save(entity)
    return OwnershipTransferMapper.toDomain(updatedEntity)
  }

  async create(transfer: OwnershipTransfer): Promise<OwnershipTransfer> {
    const entity = OwnershipTransferMapper.toTypeOrm(transfer)
    const savedEntity = await this.repository.save(entity)
    return OwnershipTransferMapper.toDomain(savedEntity)
  }

  async findById(id: UUID): Promise<OwnershipTransfer | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return OwnershipTransferMapper.toDomain(entity)
  }

  async findAll(): Promise<OwnershipTransfer[]> {
    const entities = await this.repository.find()
    return entities.map(OwnershipTransferMapper.toDomain)
  }

  async findByProductId(productId: UUID): Promise<OwnershipTransfer[]> {
    const entities = await this.repository.find({ where: { productId } })
    return entities.map(OwnershipTransferMapper.toDomain)
  }

  async findByResellerId(resellerId: UUID): Promise<OwnershipTransfer[]> {
    const entities = await this.repository.find({
      where: [{ fromResellerId: resellerId }, { toResellerId: resellerId }]
    })
    return entities.map(OwnershipTransferMapper.toDomain)
  }

  async updateStatus(
    id: UUID,
    status: OwnershipTransferStatus
  ): Promise<OwnershipTransfer> {
    await this.repository.update(id, { status })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity)
      throw new NotFoundException('Ownership transfer not found')
    return OwnershipTransferMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
