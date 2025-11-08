import { CategoryRepository } from '@/modules/category/domain/repositories/category.repository'
import { CustomerRepository } from '@/modules/customer/domain/repositories/customer.repository'
import { ProductModelRepository } from '@/modules/product-model/domain/repositories/product-model.repository'
import { ProductRepository } from '@/modules/product/domain/repositories/product.repository'
import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'
import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'
import { SaleRepository } from '@/modules/sale/domain/repositories/sale.repository'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserRepository } from '@/modules/user/domain/repositories/user.repository'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { Injectable, Inject, NotFoundException } from '@nestjs/common'

@Injectable()
export class GetAllSaleUseCase {
  constructor(
    @Inject('SaleRepository')
    private readonly saleRepository: SaleRepository,
    @Inject('CustomerRepository')
    private readonly customerRepository: CustomerRepository,
    @Inject('UserRepository')
    private readonly userRepository: UserRepository,
    @Inject('CategoryRepository')
    private readonly categoryRepository: CategoryRepository,
    @Inject('ProductRepository')
    private readonly productRepository: ProductRepository,
    @Inject('ProductModelRepository')
    private readonly productModelRepository: ProductModelRepository
  ) {}

  async execute(user: UserPayload): Promise<GetSaleDto[]> {
    const sales =
      user.role === Role.RESELLER
        ? await this.saleRepository.findByResellerId(user.id)
        : await this.saleRepository.findAll()

    const customerIds = [
      ...new Set(sales.map((s) => s.customerId).filter(Boolean))
    ]
    const resellerIds = [
      ...new Set(sales.map((s) => s.resellerId).filter(Boolean))
    ]
    const allProductIds = sales.flatMap((s) => s.productIds || [])

    const [customers, resellers, products, allCategories] = await Promise.all([
      this.customerRepository.findAllByIds(customerIds),
      this.userRepository.findManyByIds(resellerIds),
      this.productRepository.findManyByIds(allProductIds),
      this.categoryRepository.findAll()
    ])
    const modelIds = [...new Set(products.map((p) => p.modelId))]
    const models = await this.productModelRepository.findManyByIds(modelIds)

    const customerMap = new Map(customers.map((c) => [c.id, c]))
    const resellerMap = new Map(resellers.map((r) => [r.id, r]))
    const productMap = new Map(products.map((p) => [p.id, p]))
    const modelMap = new Map(models.map((m) => [m.id, m]))
    const categoryMap = new Map(allCategories.map((cat) => [cat.id, cat]))

    function getFullName(user?: {
      name?: { getValue?: () => string }
      surname?: { getValue?: () => string }
    }) {
      if (!user) return ''
      const name = user.name?.getValue?.() || ''
      const surname = user.surname?.getValue?.() || ''
      return (name + ' ' + surname).trim()
    }

    return sales.map((sale): GetSaleDto => {
      const customer = customerMap.get(sale.customerId)
      if (!customer) {
        throw new NotFoundException(
          `Cliente não encontrado para a venda ${sale.id}`
        )
      }
      const reseller = resellerMap.get(sale.resellerId)
      const productsForSale: GetSaleProductDto[] = (sale.productIds || [])
        .map((id) => productMap.get(id))
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
        resellerName: getFullName(reseller),
        products: productsForSale,
        saleDate: sale.saleDate,
        totalAmount: sale.totalAmount,
        paymentMethod: sale.paymentMethod,
        numberInstallments: sale.numberInstallments,
        status: sale.status,
        installmentsInterval: sale.installmentsInterval,
        installmentsPaid: sale.installmentsPaid
      }
    })
  }
}
