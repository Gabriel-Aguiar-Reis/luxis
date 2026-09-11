import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DataSource, Repository } from 'typeorm'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { UUID } from 'crypto'
import { SaleMapper } from '@/shared/infra/persistence/typeorm/sale/mappers/sale.mapper'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { SaleProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale-product.typeorm.entity'

@Injectable()
export class SaleTypeOrmRepository implements SaleRepository {
  constructor(
    @InjectRepository(SaleTypeOrmEntity)
    private readonly repository: Repository<SaleTypeOrmEntity>,
    private readonly dataSource: DataSource
  ) {}

  async update(sale: Sale): Promise<Sale> {
    const updatedEntity = await this.persistWithProducts(sale)
    return SaleMapper.toDomain(updatedEntity, sale.productIds)
  }

  async create(sale: Sale): Promise<Sale> {
    const savedEntity = await this.persistWithProducts(sale)
    return SaleMapper.toDomain(savedEntity, sale.productIds)
  }

  async findById(id: UUID): Promise<Sale | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    const productIds = await this.findProductIdsBySaleId(entity.id)
    return SaleMapper.toDomain(entity, productIds)
  }

  async findAll(): Promise<Sale[]> {
    const entities = await this.repository.find()
    return await this.toDomainList(entities)
  }

  async findByResellerId(resellerId: UUID): Promise<Sale[]> {
    const entities = await this.repository.find({ where: { resellerId } })
    return await this.toDomainList(entities)
  }

  async delete(id: UUID): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      await manager.delete(SaleProductTypeOrmEntity, { saleId: id })
      await manager.delete(SaleTypeOrmEntity, { id })
    })
  }

  private async persistWithProducts(sale: Sale): Promise<SaleTypeOrmEntity> {
    return await this.dataSource.transaction(async (manager) => {
      const entity = await manager.save(
        SaleTypeOrmEntity,
        SaleMapper.toTypeOrm(sale)
      )
      await manager.delete(SaleProductTypeOrmEntity, { saleId: sale.id })
      await manager.save(
        SaleProductTypeOrmEntity,
        sale.productIds.map((productId, index) => ({
          saleId: sale.id,
          productId,
          position: index
        }))
      )
      return entity
    })
  }

  private async findProductIdsBySaleId(saleId: UUID): Promise<UUID[]> {
    const saleProductRepository = this.dataSource.getRepository(
      SaleProductTypeOrmEntity
    )
    const saleProducts = await saleProductRepository.find({
      where: { saleId },
      order: { position: 'ASC' }
    })

    return saleProducts.map((saleProduct) => saleProduct.productId)
  }

  private async toDomainList(entities: SaleTypeOrmEntity[]): Promise<Sale[]> {
    if (entities.length === 0) return []

    const saleIds = entities.map((entity) => entity.id)
    const saleProductRepository = this.dataSource.getRepository(
      SaleProductTypeOrmEntity
    )
    const saleProducts = await saleProductRepository
      .createQueryBuilder('saleProduct')
      .where('saleProduct.sale_id IN (:...saleIds)', { saleIds })
      .orderBy('saleProduct.sale_id', 'ASC')
      .addOrderBy('saleProduct.position', 'ASC')
      .getMany()

    const productsBySaleId = new Map<UUID, UUID[]>()
    for (const saleProduct of saleProducts) {
      const productIds = productsBySaleId.get(saleProduct.saleId) ?? []
      productIds.push(saleProduct.productId)
      productsBySaleId.set(saleProduct.saleId, productIds)
    }

    return entities.map((entity) =>
      SaleMapper.toDomain(entity, productsBySaleId.get(entity.id))
    )
  }
}
