import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { UpdateShipmentDto } from '@/modules/shipment/application/dtos/update-shipment-dto'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(id: UUID, input: UpdateShipmentDto): Promise<Shipment | null> {
    let shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }
    shipment = new Shipment(
      id,
      input.resellerId ?? shipment.resellerId,
      shipment.createdAt,
      shipment.status,
      input.productIds ?? shipment.productIds
    )
    return this.shipmentRepository.update(shipment)
  }
}
