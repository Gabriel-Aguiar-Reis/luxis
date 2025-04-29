import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(id: UUID): Promise<Shipment | null> {
    const shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    return shipment
  }
}
