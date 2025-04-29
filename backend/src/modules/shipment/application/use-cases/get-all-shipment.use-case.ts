import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(): Promise<Shipment[]> {
    return await this.shipmentRepository.findAll()
  }
}
