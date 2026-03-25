import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { Category } from '@/modules/category/domain/entities/category.entity'
import { Customer } from '@/modules/customer/domain/entities/customer.entity'
import { Inventory } from '@/modules/inventory/domain/entities/inventory.entity'
import { OwnershipTransfer } from '@/modules/ownership-transfer/domain/entities/ownership-transfer.entity'
import { PasswordResetRequest } from '@/modules/auth/domain/entities/password-reset-request.entity'
import { Product } from '@/modules/product/domain/entities/product.entity'
import { ProductModel } from '@/modules/product-model/domain/entities/product-model.entity'
import { Return } from '@/modules/return/domain/entities/return.entity'
import { Sale } from '@/modules/sale/domain/entities/sale.entity'
import { Shipment } from '@/modules/shipment/domain/entities/shipment.entity'
import { Supplier } from '@/modules/supplier/domain/entities/supplier.entity'
import { User } from '@/modules/user/domain/entities/user.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { InferSubjects, PureAbility } from '@casl/ability'

export type Subjects =
  | InferSubjects<typeof Batch>
  | InferSubjects<typeof Category>
  | InferSubjects<typeof Customer>
  | InferSubjects<typeof Inventory>
  | InferSubjects<typeof OwnershipTransfer>
  | InferSubjects<typeof PasswordResetRequest>
  | InferSubjects<typeof Product>
  | InferSubjects<typeof ProductModel>
  | InferSubjects<typeof Return>
  | InferSubjects<typeof Sale>
  | InferSubjects<typeof Shipment>
  | InferSubjects<typeof Supplier>
  | InferSubjects<typeof User>
  | 'admin-kpi'
  | 'reseller-kpi'
  | 'all'

export type AppAbility = PureAbility<[Actions, Subjects]>
