import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'
import { ShipmentMapper } from '@/shared/infra/persistence/typeorm/shipment/mappers/shipment.mapper'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { UUID } from 'crypto'

@Injectable()
export class ShipmentTypeOrmRepository implements ShipmentRepository {
  constructor(
    @InjectRepository(ShipmentTypeOrmEntity)
    private readonly repository: Repository<ShipmentTypeOrmEntity>
  ) {}

  async findAll(): Promise<Shipment[]> {
    const entities = await this.repository.find()
    return entities.map(ShipmentMapper.toDomain)
  }

  async findAllByResellerId(resellerId: UUID): Promise<Shipment[]> {
    const entities = await this.repository.find({ where: { resellerId } })
    return entities.map(ShipmentMapper.toDomain)
  }

  async findById(id: UUID): Promise<Shipment | null> {
    const entity = await this.repository.findOne({ where: { id } })
    if (!entity) return null
    return ShipmentMapper.toDomain(entity)
  }

  async create(shipment: Shipment): Promise<Shipment> {
    const entity = ShipmentMapper.toTypeOrm(shipment)
    const savedEntity = await this.repository.save(entity)
    return ShipmentMapper.toDomain(savedEntity)
  }

  async update(shipment: Shipment): Promise<Shipment> {
    const entity = ShipmentMapper.toTypeOrm(shipment)
    const updatedEntity = await this.repository.save(entity)
    return ShipmentMapper.toDomain(updatedEntity)
  }

  async updateStatus(id: UUID, status: ShipmentStatus): Promise<Shipment> {
    await this.repository.update(id, { status })
    const updatedEntity = await this.repository.findOne({ where: { id } })
    if (!updatedEntity) throw new NotFoundException('Shipment not found')
    return ShipmentMapper.toDomain(updatedEntity)
  }

  async delete(id: UUID): Promise<void> {
    await this.repository.delete(id)
  }
}
