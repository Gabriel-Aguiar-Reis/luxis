import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class DeleteShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(id: UUID): Promise<void> {
    const shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    if (shipment.status !== ShipmentStatus.PENDING) {
      throw new BadRequestException(
        `Cannot delete shipment with status: ${shipment.status}`
      )
    }

    return await this.shipmentRepository.delete(id)
  }
}
