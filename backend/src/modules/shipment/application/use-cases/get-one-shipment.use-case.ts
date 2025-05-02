import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import {
  Injectable,
  Inject,
  NotFoundException,
  ForbiddenException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class GetOneShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<Shipment | null> {
    const shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    if (user.role === Role.RESELLER && shipment.resellerId !== user.id) {
      throw new ForbiddenException(
        'You are not allowed to access this shipment'
      )
    }

    return shipment
  }
}
