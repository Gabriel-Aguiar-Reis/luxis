import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { OwnershipTransferWithSerialDto } from "@/modules/ownership-transfer/application/dtos/ownership-transfer-with-serial.dto"
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { OwnershipTransferRepository } from '@/modules/ownership-transfer/domain/repositories/ownership-transfer.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject } from '@nestjs/common'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'

@Injectable()
export class GetAllOwnershipTransferUseCase {
  constructor(
    @Inject('OwnershipTransferRepository')
    private readonly ownershipTransferRepository: OwnershipTransferRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository
  ) {}

  async execute(user: UserPayload): Promise<OwnershipTransferWithSerialDto[]> {
    let transfers: OwnershipTransfer[]
    if (user.role === Role.ADMIN || user.role === Role.ASSISTANT) {
      transfers = await this.ownershipTransferRepository.findAll()
    } else {
      transfers = await this.ownershipTransferRepository.findAllByResellerId(user.id)
    }

    const productIds = [...new Set(transfers.map(t => t.productId))]
    const resellerIds = [...new Set(transfers.flatMap(t => [t.fromResellerId, t.toResellerId]))]

    const [products, resellers] = await Promise.all([
      this.productRepository.findManyByIds(productIds),
      this.userRepository.findManyByIds(resellerIds)
    ])

    const productMap = new Map(products.map(p => [p.id, p]))
    const resellerMap = new Map(resellers.map(r => [r.id, r]))

    function getFullName(user?: { name: { getValue(): string }, surname: { getValue(): string } }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    return transfers.map(t => {
      const product = productMap.get(t.productId)
      const fromReseller = resellerMap.get(t.fromResellerId)
      const toReseller = resellerMap.get(t.toResellerId)
      return {
        id: t.id,
        productId: t.productId,
        serialNumber: product?.serialNumber?.getValue() ?? '',
        fromResellerId: t.fromResellerId,
        fromResellerName: getFullName(fromReseller),
        toResellerId: t.toResellerId,
        toResellerName: getFullName(toReseller),
        transferDate: t.transferDate,
        status: t.status
      }
    })
  }
}
