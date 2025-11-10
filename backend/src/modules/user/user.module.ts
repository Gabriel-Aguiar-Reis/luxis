import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { GetOneUserUseCase } from '@/modules/user/application/use-cases/get-one-user.use-case'
import { UserController } from '@/modules/user/presentation/user.controller'
import { forwardRef, Module } from '@nestjs/common'
import { GetAllUserUseCase } from '@/modules/user/application/use-cases/get-all-user.use-case'
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/delete-user.use-case'
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case'
import { DisableUserUseCase } from '@/modules/user/application/use-cases/disable-user.use-case'
import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { UpdateUserStatusUseCase } from '@/modules/user/application/use-cases/update-user-status.use-case'
import { GetUserProductsUseCase } from '@/modules/user/application/use-cases/get-user-products.use-case'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { InventoryService } from '@/modules/inventory/application/services/inventory.service'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { ProductTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product/product.typeorm.repository'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ProductModelTypeOrmRepository } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.repository'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { GetAllPendingUserUseCase } from '@/modules/user/application/use-cases/get-all-pending-user.use-case'

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      InventoryTypeOrmEntity,
      ProductTypeOrmEntity,
      ProductModelTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [UserController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateUserUseCase,
    GetOneUserUseCase,
    GetAllUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    UpdateUserRoleUseCase,
    DisableUserUseCase,
    UpdateUserStatusUseCase,
    GetUserProductsUseCase,
    GetAllPendingUserUseCase,
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'InventoryService', useClass: InventoryService },
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository },
    { provide: 'ProductRepository', useClass: ProductTypeOrmRepository },
    {
      provide: 'ProductModelRepository',
      useClass: ProductModelTypeOrmRepository
    },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class UserModule {}
