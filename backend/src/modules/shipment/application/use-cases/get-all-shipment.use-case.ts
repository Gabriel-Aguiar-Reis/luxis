import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject } from '@nestjs/common'

@Injectable()
export class GetAllShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(user: UserPayload): Promise<Shipment[]> {
    if (user.role === Role.RESELLER) {
      return await this.shipmentRepository.findAllByResellerId(user.id)
    }

    return await this.shipmentRepository.findAll()
  }
}
