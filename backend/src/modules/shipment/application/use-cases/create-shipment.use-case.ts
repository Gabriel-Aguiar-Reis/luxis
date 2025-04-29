import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { CreateShipmentDto } from '@/modules/shipment/presentation/dtos/create-shipment-dto'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class CreateShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(input: CreateShipmentDto): Promise<Shipment> {
    const shipment = new Shipment(
      crypto.randomUUID(),
      input.resellerId,
      new Date(),
      ShipmentStatus.PENDING,
      input.productIds
    )

    return await this.shipmentRepository.create(shipment)
  }
}
