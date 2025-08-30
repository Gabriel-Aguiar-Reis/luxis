import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException
} from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UUID } from 'crypto'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { GetOneReturnDto } from '@/modules/return/application/dtos/get-one-return.dto'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'

@Injectable()
export class GetOneReturnUseCase {
  constructor(
    @Inject('ReturnRepository')
    private readonly returnRepository: ReturnRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository

  ) {}

  async execute(id: UUID, user: UserPayload): Promise<GetOneReturnDto> {
    const returnEntity = await this.returnRepository.findById(id)
    if (!returnEntity) {
      throw new NotFoundException('Return not found')
    }
    if (user.role === Role.RESELLER && returnEntity.resellerId !== user.id) {
      throw new ForbiddenException('You are not allowed to access this return')
    }
    const reseller = await this.userRepository.findById(returnEntity.resellerId)
    // Buscar todos os produtos de uma vez
    const products = await this.productRepository.findManyByIds(returnEntity.productIds)
    // Buscar todos os modelos de uma vez
    const modelIds = products.map((p) => p.modelId)
    const models = await this.productModelRepository.findManyByIds(modelIds)
    const modelMap = new Map(models.map((m) => [m.id, m]))

    return {
      id: returnEntity.id,
      resellerId: returnEntity.resellerId,
      resellerName: `${reseller?.name.getValue()} ${reseller?.surname.getValue()}`,
      products: products.map((p) => ({
        productId: p.id,
        productModelName: modelMap.get(p.modelId)!.name,
        serialNumber: p.serialNumber
      })),
      status: returnEntity.status,
      createdAt: returnEntity.createdAt
    }
  }
}
