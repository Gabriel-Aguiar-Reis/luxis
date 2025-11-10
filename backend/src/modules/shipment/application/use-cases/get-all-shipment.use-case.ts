import { Injectable, Inject, NotFoundException } from '@nestjs/common'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { GetShipmentDto } from '@/modules/shipment/application/dtos/get-shipment.dto'

@Injectable()
export class GetAllShipmentUseCase {
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

  async execute(user: UserPayload): Promise<GetShipmentDto[]> {
    function getFullName(user?: {
      name?: { getValue?: () => string }
      surname?: { getValue?: () => string }
    }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    if (user.role === Role.RESELLER) {
      const shipments = await this.shipmentRepository.findAllByResellerId(
        user.id
      )
      const allProductIds = shipments.flatMap((s) => s.productIds)
      const products = await this.productRepository.findManyByIds(allProductIds)
      const productMap = new Map(products.map((p) => [p.id, p]))
      const allModelIds = products.map((p) => p.modelId)
      const models =
        await this.productModelRepository.findManyByIds(allModelIds)
      const modelMap = new Map(models.map((m) => [m.id, m]))
      const reseller = await this.userRepository.findById(user.id)
      if (!reseller) {
        throw new NotFoundException('Reseller not found')
      }
      const resellerName = getFullName(reseller)
      return shipments.map((shipment) => {
        const productsForShipment = shipment.productIds
          .map((id) => productMap.get(id))
          .filter((p): p is (typeof products)[number] => !!p)
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
        return {
          id: shipment.id,
          resellerId: shipment.resellerId,
          resellerName,
          createdAt: shipment.createdAt,
          status: shipment.status,
          products: productsForShipment
        }
      })
    }

    const shipments = await this.shipmentRepository.findAll()
    const resellerIds = [...new Set(shipments.flatMap((s) => s.resellerId))]
    const allProductIds = shipments.flatMap((s) => s.productIds)
    const resellers = await this.userRepository.findManyByIds(resellerIds)
    const products = await this.productRepository.findManyByIds(allProductIds)
    const allModelIds = products.map((p) => p.modelId)
    const models = await this.productModelRepository.findManyByIds(allModelIds)
    const resellerMap = new Map(resellers.map((r) => [r.id, r]))
    const productMap = new Map(products.map((p) => [p.id, p]))
    const modelMap = new Map(models.map((m) => [m.id, m]))
    return shipments.map((shipment) => {
      const reseller = resellerMap.get(shipment.resellerId)
      const resellerName = getFullName(reseller)
      return {
        id: shipment.id,
        resellerId: shipment.resellerId,
        resellerName,
        createdAt: shipment.createdAt,
        status: shipment.status,
        products: shipment.productIds
          .map((id) => productMap.get(id))
          .filter((p): p is (typeof products)[number] => !!p)
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
    })
  }
}
