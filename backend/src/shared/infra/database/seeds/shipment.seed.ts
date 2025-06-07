import { Injectable, Inject } from '@nestjs/common'
import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { CreateShipmentDto } from '@/modules/shipment/application/dtos/create-shipment-dto'
import * as crypto from 'crypto'

@Injectable()
export class ShipmentSeed {
  constructor(private readonly createShipmentUseCase: CreateShipmentUseCase) {}

  async run(
    resellerId: crypto.UUID,
    productIds: crypto.UUID[]
  ): Promise<string> {
    const dto: CreateShipmentDto = {
      resellerId,
      productIds
    }
    const shipment = await this.createShipmentUseCase.execute(dto)
    return shipment.id
  }
}
