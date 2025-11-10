import { Inject, Injectable } from '@nestjs/common'
import { ReturnRepository } from '@/modules/return/domain/repositories/return.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { GetAllReturnDto } from '@/modules/return/application/dtos/get-all-return.dto'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { Product } from '@/modules/product/domain/entities/product.entity'

@Injectable()
export class GetAllReturnUseCase {
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

  async execute(user: UserPayload): Promise<GetAllReturnDto[]> {
    if (user.role === Role.RESELLER) {
      const returns = await this.returnRepository.findByResellerId(user.id)

      if (returns.length === 0) {
        return []
      }

      // Buscar o usuário do banco para garantir dados atualizados
      const resellerUser = await this.userRepository.findById(user.id)
      const resellerName = resellerUser
        ? `${resellerUser.name.getValue()} ${resellerUser.surname.getValue()}`.trim()
        : user.name || ''

      const allProductIds = returns.flatMap((ret) => ret.productIds)
      const products = await this.productRepository.findManyByIds(allProductIds)
      const productMap = new Map(products.map((p) => [p.id, p]))
      const allModelIds = products.map((p) => p.modelId)
      const models =
        await this.productModelRepository.findManyByIds(allModelIds)
      const modelMap = new Map(models.map((m) => [m.id, m]))

      return returns.map((ret) => {
        const productsForReturn = ret.productIds
          .map((id) => productMap.get(id))
          .filter((p): p is Product => !!p)
          .map((p) => ({
            productId: p.id,
            productModelName: modelMap.get(p.modelId)!.name,
            serialNumber: p.serialNumber
          }))

        return {
          ...ret,
          resellerName,
          products: productsForReturn
        }
      })
    }
    const returns = await this.returnRepository.findAll()
    const resellerIds = [...new Set(returns.flatMap((r) => r.resellerId))]
    const allProductIds = returns.flatMap((ret) => ret.productIds)
    const resellers = await this.userRepository.findManyByIds(resellerIds)
    const products = await this.productRepository.findManyByIds(allProductIds)
    const allModelIds = products.map((p) => p.modelId)
    const models = await this.productModelRepository.findManyByIds(allModelIds)
    const resellerMap = new Map(resellers.map((r) => [r.id, r]))
    const productMap = new Map(products.map((p) => [p.id, p]))
    const modelMap = new Map(models.map((m) => [m.id, m]))

    return returns.map((ret) => {
      const reseller = resellerMap.get(ret.resellerId)
      const resellerName = reseller
        ? `${reseller.name.getValue()} ${reseller.surname.getValue()}`.trim()
        : ''

      return {
        ...ret,
        resellerName,
        products: ret.productIds
          .map((id) => productMap.get(id))
          .filter((p): p is Product => !!p)
          .map((p) => ({
            productId: p.id,
            productModelName: modelMap.get(p.modelId)!.name,
            serialNumber: p.serialNumber
          }))
      }
    })
  }
}
