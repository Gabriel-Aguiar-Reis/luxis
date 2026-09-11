import { Category } from '@/modules/category/domain/entities/category.entity'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { GetSaleProductDto } from '@/modules/sale/application/dtos/get-sale-product.dto'
import { GetSaleDto } from '@/modules/sale/application/dtos/get-sale.dto'
import { SaleResponseDto } from '@/modules/sale/application/dtos/sale-response.dto'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'

type ResellerName = {
  name?: { getValue?: () => string }
  surname?: { getValue?: () => string }
}

export class SaleResponseMapper {
  static toProductDto(
    product: Product,
    model: ProductModel,
    category: Category
  ): GetSaleProductDto {
    return {
      id: product.id,
      modelId: product.modelId,
      categoryId: model.categoryId,
      serialNumber: product.serialNumber.getValue(),
      salePrice: product.salePrice.getValue(),
      modelName: model.name.getValue(),
      categoryName: category.name.getValue()
    }
  }

  static toDto(
    sale: Sale,
    customer: Customer,
    reseller: ResellerName | undefined,
    products: GetSaleProductDto[]
  ): GetSaleDto {
    return {
      id: sale.id,
      customerId: sale.customerId,
      customerName: customer.name.getValue(),
      customerPhone: customer.phone.getValue(),
      resellerId: sale.resellerId,
      resellerName: SaleResponseMapper.getFullName(reseller),
      products,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue(),
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments.getValue(),
      status: sale.status,
      installmentsInterval: sale.installmentsInterval.getValue(),
      installmentsPaid: sale.installmentsPaid.getValue()
    }
  }

  static toResponseDto(sale: Sale): SaleResponseDto {
    return {
      id: sale.id,
      customerId: sale.customerId,
      resellerId: sale.resellerId,
      productIds: sale.productIds,
      saleDate: sale.saleDate,
      totalAmount: sale.totalAmount.getValue(),
      paymentMethod: sale.paymentMethod,
      numberInstallments: sale.numberInstallments.getValue(),
      status: sale.status,
      installmentsInterval: sale.installmentsInterval.getValue(),
      installmentsPaid: sale.installmentsPaid.getValue()
    }
  }

  private static getFullName(user?: ResellerName): string {
    if (!user) return ''
    const name = user.name?.getValue?.() || ''
    const surname = user.surname?.getValue?.() || ''
    return `${name} ${surname}`.trim()
  }
}
