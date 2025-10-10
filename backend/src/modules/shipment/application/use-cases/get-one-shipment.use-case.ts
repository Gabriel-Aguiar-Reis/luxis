import { GetShipmentDto } from '@/modules/shipment/application/dtos/get-shipment.dto'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
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
    private readonly shipmentRepository: ShipmentRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<GetShipmentDto> {
    function getFullName(user?: { name?: { getValue?: () => string }, surname?: { getValue?: () => string } }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    const shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    if (user.role === Role.RESELLER && shipment.resellerId !== user.id) {
      throw new ForbiddenException('You are not allowed to access this shipment')
    }

    const products = await this.productRepository.findManyByIds(shipment.productIds)
    const allModelIds = products.map((p) => p.modelId)
    const models = await this.productModelRepository.findManyByIds(allModelIds)
    const modelMap = new Map(models.map((m) => [m.id, m]))

    const reseller = await this.userRepository.findById(shipment.resellerId)
  const resellerName = getFullName(reseller ?? undefined)

    return {
      id: shipment.id,
      resellerId: shipment.resellerId,
      resellerName,
      createdAt: shipment.createdAt,
      status: shipment.status,
      products: shipment.productIds
        .map((id) => products.find((p) => p.id === id))
        .filter((p): p is typeof products[number] => !!p)
        .map((p) => {
          const model = modelMap.get(p.modelId)
          if (!model) return undefined
          return {
            id: p.id,
            modelId: p.modelId,
            modelName: model.name,
            serialNumber: p.serialNumber,
            salePrice: p.salePrice
          }
        })
        .filter((p): p is NonNullable<typeof p> => !!p)
    }
  }
}
