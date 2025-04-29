import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { ShipmentStatus } from '@/modules/shipment/domain/enums/shipment-status.enum'
import { ShipmentRepository } from '@/modules/shipment/domain/repositories/shipment.repository'
import { ShipmentStatusManager } from '@/modules/shipment/domain/services/shipment-status-manager.service'
import {
  Injectable,
  Inject,
  NotFoundException,
  BadRequestException
} from '@nestjs/common'
import { UUID } from 'crypto'

@Injectable()
export class UpdateStatusShipmentUseCase {
  constructor(
    @Inject('ShipmentRepository')
    private readonly shipmentRepository: ShipmentRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository
  ) {}

  async execute(id: UUID, status: ShipmentStatus): Promise<Shipment | null> {
    let shipment = await this.shipmentRepository.findById(id)
    if (!shipment) {
      throw new NotFoundException('Shipment not found')
    }

    if (!ShipmentStatusManager.canTransition(shipment.status, status)) {
      throw new BadRequestException(
        `Invalid status transition: ${shipment.status} -> ${status}`
      )
    }

    if (status !== ShipmentStatus.DELIVERED) {
      return await this.shipmentRepository.updateStatus(id, status)
    }

    const products = await this.productRepository.findManyByIds(
      shipment.productIds
    )

    const updatedProducts = products.map((product) => {
      product.status = ProductStatus.ASSIGNED
      return product
    })

    await Promise.all(
      updatedProducts.map((product) => this.productRepository.update(product))
    )

    // TODO -> criar o evento que dispará a adição no inventário

    return await this.shipmentRepository.updateStatus(id, status)
  }
}
