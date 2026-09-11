import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { InventoryRepository } from '@/modules/inventory/domain/repositories/inventory.repository'
import { InventoryMapper } from '@/shared/infra/persistence/typeorm/inventory/mappers/inventory.mapper'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { InventoryProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory-product.typeorm.entity'
import { UUID } from 'crypto'

@Injectable()
export class InventoryTypeOrmRepository implements InventoryRepository {
  constructor(
    @InjectRepository(InventoryTypeOrmEntity)
    private readonly repository: Repository<InventoryTypeOrmEntity>,
    private readonly dataSource: DataSource
  ) {}

  async findByResellerId(resellerId: UUID): Promise<Inventory | null> {
    const entity = await this.repository.findOne({ where: { resellerId } })
    if (!entity) return null
    const productIds = await this.findProductIdsByResellerId(resellerId)
    return InventoryMapper.toDomain(entity, productIds)
  }

  async save(inventory: Inventory): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const entity = InventoryMapper.toTypeOrm(inventory)
      await manager.save(InventoryTypeOrmEntity, entity)
      await manager.delete(InventoryProductTypeOrmEntity, {
        resellerId: inventory.resellerId
      })
      await manager.save(
        InventoryProductTypeOrmEntity,
        inventory.products.map((productId) => ({
          resellerId: inventory.resellerId,
          productId
        }))
      )
    })
  }

  private async findProductIdsByResellerId(resellerId: UUID): Promise<UUID[]> {
    const inventoryProductRepository = this.dataSource.getRepository(
      InventoryProductTypeOrmEntity
    )
    const inventoryProducts = await inventoryProductRepository.find({
      where: { resellerId },
      order: { assignedAt: 'ASC' }
    })

    return inventoryProducts.map(
      (inventoryProduct) => inventoryProduct.productId
    )
  }
}
