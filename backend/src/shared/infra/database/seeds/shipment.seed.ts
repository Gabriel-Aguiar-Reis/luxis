import { Injectable } from '@nestjs/common'
import { CreateShipmentUseCase } from '@/modules/shipment/application/use-cases/create-shipment.use-case'
import { CreateShipmentDto } from '@/modules/shipment/application/dtos/create-shipment-dto'
import * as crypto from 'crypto'
import { UpdateStatusShipmentUseCase } from '@/modules/shipment/application/use-cases/update-status-shipment.use-case'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'

@Injectable()
export class ShipmentSeed {
  constructor(
    private readonly createShipmentUseCase: CreateShipmentUseCase,
    private readonly updateStatusShipmentUseCase: UpdateStatusShipmentUseCase
  ) {}

  async run(
    resellerId: crypto.UUID,
    productIds: crypto.UUID[],
    user: UserPayload
  ): Promise<string> {
    const dto: CreateShipmentDto = {
      resellerId,
      productIds
    }
    const shipment = await this.createShipmentUseCase.execute(dto)

    await this.updateStatusShipmentUseCase.execute(
      shipment.id,
      ShipmentStatus.APPROVED,
      user
    )

    await this.updateStatusShipmentUseCase.execute(
      shipment.id,
      ShipmentStatus.DELIVERED,
      user
    )
    return shipment.id
  }
}
