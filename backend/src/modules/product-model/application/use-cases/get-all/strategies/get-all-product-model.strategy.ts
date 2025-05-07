import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'

export interface GetAllProductModelStrategy {
  execute(user: UserPayload): Promise<ProductModel[]>
}
