import {
  Injectable,
  Inject,
  NotFoundException,
  UnauthorizedException
} from '@nestjs/common'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { UUID } from 'crypto'
import { GetOneSaleStrategy } from '@/modules/sale/application/use-cases/get-one/strategies/get-one-sale.strategy'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'

@Injectable()
export class GetOneSaleResellerStrategy implements GetOneSaleStrategy {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(id: UUID, user: UserPayload): Promise<GetSaleDto> {
    const sale = await this.saleRepository.findById(id)
    if (!sale) {
      throw new NotFoundException('Sale not found')
    }

    if (sale.resellerId !== user.id) {
      throw new UnauthorizedException(
        'You are not authorized to view this sale'
      )
    }

    // Carregar entidades relacionadas
    const [customer, reseller] = await Promise.all([
      this.customerRepository.findById(sale.customerId),
      this.userRepository.findById(sale.resellerId)
    ])

    if (!customer) {
      throw new NotFoundException(
        `Cliente não encontrado para a venda ${sale.id}`
      )
    }

    const products = await this.productRepository.findManyByIds(
      sale.productIds || []
    )
    const modelIds = [...new Set(products.map((p) => p.modelId))]
    const models = await this.productModelRepository.findManyByIds(modelIds)
    const categories = await this.categoryRepository.findAll()

    const modelMap = new Map(models.map((m) => [m.id, m]))
    const categoryMap = new Map(categories.map((c) => [c.id, c]))

    function getFullName(user?: {
      name?: { getValue?: () => string }
      surname?: { getValue?: () => string }
    }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    const productsForSale: GetSaleProductDto[] = (sale.productIds || [])
      .map((id) => products.find((p) => p.id === id))
      .filter((p): p is (typeof products)[0] => !!p)
      .map((p) => {
        const model = modelMap.get(p.modelId)
        const category = model ? categoryMap.get(model.categoryId) : undefined
        if (!model || !category) return null
        return {
          id: p.id,
          modelId: p.modelId,
          categoryId: model.categoryId,
          serialNumber: p.serialNumber,
          salePrice: p.salePrice,
          modelName: model.name,
          categoryName: category.name
        }
      })
      .filter((p): p is GetSaleProductDto => p !== null)

    return {
      id: sale.id,
      customerId: sale.customerId,
      customerName: customer.name,
      customerPhone: customer.phone,
      resellerId: sale.resellerId,
      resellerName: getFullName(reseller || undefined),
      products: productsForSale,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount,
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments,
      status: sale.status,
      installmentsInterval: sale.installmentsInterval,
      installmentsPaid: sale.installmentsPaid
    }
  }
}
