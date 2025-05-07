import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryRepository } from '@/modules/inventory/domain/repositories/inventory.repository'
import { InventoryMapper } from '@/shared/infra/persistence/typeorm/inventory/mappers/inventory.mapper'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { UUID } from 'crypto'

@Injectable()
export class InventoryTypeOrmRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryTypeOrmEntity)
    private readonly repository: Repository<InventoryTypeOrmEntity>
  ) {}

  async findByResellerId(resellerId: UUID): Promise<Inventory | null> {
    const entity = await this.repository.findOne({ where: { resellerId } })
    if (!entity) return null
    return InventoryMapper.toDomain(entity)
  }

  async save(inventory: Inventory): Promise<void> {
    const entity = InventoryMapper.toTypeOrm(inventory)
    await this.repository.save(entity)
  }
}
