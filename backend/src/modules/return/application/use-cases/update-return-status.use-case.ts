import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'
import { ReturnStatus } from '@/modules/return/domain/enums/return-status.enum'
import { Return } from '@/modules/return/domain/entities/return.entity'
import { ReturnStatusManager } from '@/modules/return/domain/services/return-status-manager.service'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { ReturnConfirmedEvent } from '@/modules/return/domain/events/return-confirmed.event'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductStatus } from '@/modules/product/domain/enums/product-status.enum'
@Injectable()
export class UpdateReturnStatusUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    private readonly eventDispatcher: EventDispatcher
  ) {}

  async execute(id: UUID, status: ReturnStatus, user: UserPayload) {
    let returnEntity = await this.returnRepository.findById(id)
    if (!returnEntity) {
      throw new NotFoundException('Return not found')
    }

    if (!ReturnStatusManager.canTransition(returnEntity.status, status)) {
      throw new BadRequestException('Invalid return status transition')
    }

    if (status !== ReturnStatus.RETURNED) {
      return await this.returnRepository.updateStatus(id, status)
    }

    // Atualizar status dos produtos de ASSIGNED para IN_STOCK
    const products = await this.productRepository.findManyByIds(
      returnEntity.productIds
    )

    const updatedProducts = products.map((product) => {
      product.status = ProductStatus.IN_STOCK
      return product
    })

    await Promise.all(
      updatedProducts.map((product) => this.productRepository.update(product))
    )

    returnEntity = new Return(
      returnEntity.id,
      returnEntity.resellerId,
      returnEntity.productIds,
      status,
      returnEntity.createdAt
    )

    await this.returnRepository.update(returnEntity)

    await this.eventDispatcher.dispatch(
      new ReturnConfirmedEvent(
        returnEntity.id,
        returnEntity.resellerId,
        returnEntity.productIds,
        user
      )
    )
  }
}
