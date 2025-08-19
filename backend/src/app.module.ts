import { AdminKpiCaslRule } from './shared/infra/auth/casl/rules/admin-kpi.rules'
import { ConfigModule } from '@/shared/config/config.module'
import { databaseConfig } from '@/shared/config/database.config'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { SaleCaslRule } from '@/shared/infra/auth/casl/rules/sale.rules'
import { UserCaslRule } from '@/shared/infra/auth/casl/rules/user.rules'
import { BatchCaslRule } from '@/shared/infra/auth/casl/rules/batch.rules'
import { CategoryCaslRule } from '@/shared/infra/auth/casl/rules/category.rules'
import { OwnershipTransferCaslRule } from '@/shared/infra/auth/casl/rules/ownership-transfer.rules'
import { ProductCaslRule } from '@/shared/infra/auth/casl/rules/product.rules'
import { ProductModelCaslRule } from '@/shared/infra/auth/casl/rules/product-model.rules'
import { ShipmentCaslRule } from '@/shared/infra/auth/casl/rules/shipment.rules'
import { JwtStrategy } from '@/shared/infra/auth/jwt/jwt.strategy'
import { Module, forwardRef } from '@nestjs/common'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
import { LoggerModule } from 'nestjs-pino'
import { LoggingModule } from '@/shared/infra/logging/logging.module'
import { BatchModule } from '@/modules/batch/batch.module'
import { CategoryModule } from '@/modules/category/category.module'
import { OwnershipTransferModule } from '@/modules/ownership-transfer/ownership-transfer.module'
import { ProductModule } from '@/modules/product/product.module'
import { ProductModelModule } from '@/modules/product-model/product-model.module'
import { SaleModule } from '@/modules/sale/sale.module'
import { ShipmentModule } from '@/modules/shipment/shipment.module'
import { UserModule } from '@/modules/user/user.module'
import { SupplierModule } from '@/modules/supplier/supplier.module'
import { SupplierCaslRule } from '@/shared/infra/auth/casl/rules/supplier.rules'
import { ReturnModule } from '@/modules/return/return.module'
import { ReturnCaslRule } from '@/shared/infra/auth/casl/rules/return.rules'
import { CustomerModule } from '@/modules/customer/customer.module'
import { CustomerCaslRule } from '@/shared/infra/auth/casl/rules/customer.rules'
import { AuthModule } from '@/modules/auth/auth.module'
import { AppConfigService } from '@/shared/config/app-config.service'
import { InventoryModule } from '@/modules/inventory/inventory.module'
import { SeedsModule } from '@/shared/infra/database/seeds/seeds.module'
import { CacheModule } from '@nestjs/cache-manager'
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler'
import { APP_GUARD } from '@nestjs/core'
import { AdminKpiModule } from '@/modules/kpi/admin/admin-kpi.module'
import { ResellerKpiModule } from '@/modules/kpi/reseller/reseller-kpi.module'
import { InventoryCaslRule } from '@/shared/infra/auth/casl/rules/inventory.rules'

@Module({
  imports: [
    ConfigModule,
    ThrottlerModule.forRoot({
      throttlers: [
        {
          ttl: 10000,
          limit: 10,

        },
      ],
    }),
    CacheModule.register({
      isGlobal: true,
      ttl: 60000,
      max: 100
    }),
    LoggerModule.forRoot({
      pinoHttp: {
        transport: {
          target: 'pino-pretty',
          options: {
            singleLine: true,
            colorize: true,
            levelFirst: true,
            translateTime: 'SYS:standard'
          }
        },
        level: 'trace'
      }
    }),
    LoggingModule,
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: databaseConfig
    }),
    PassportModule,
    forwardRef(() => BatchModule),
    forwardRef(() => CategoryModule),
    forwardRef(() => OwnershipTransferModule),
    forwardRef(() => ProductModule),
    forwardRef(() => ProductModelModule),
    forwardRef(() => SaleModule),
    forwardRef(() => ShipmentModule),
    forwardRef(() => UserModule),
    forwardRef(() => SupplierModule),
    forwardRef(() => ReturnModule),
    forwardRef(() => CustomerModule),
    forwardRef(() => AuthModule),
    forwardRef(() => InventoryModule),
    forwardRef(() => SeedsModule),
    forwardRef(() => AdminKpiModule),
    forwardRef(() => ResellerKpiModule)
  ],
  controllers: [],
  providers: [
    JwtStrategy,
    CaslAbilityFactory,
    SaleCaslRule,
    UserCaslRule,
    BatchCaslRule,
    CategoryCaslRule,
    OwnershipTransferCaslRule,
    ProductCaslRule,
    ProductModelCaslRule,
    ShipmentCaslRule,
    SupplierCaslRule,
    ReturnCaslRule,
    CustomerCaslRule,
    InventoryCaslRule,
    AdminKpiCaslRule,
    {
      provide: 'CASL_RULE_BUILDERS',
      useFactory: (
        saleRule: SaleCaslRule,
        userRule: UserCaslRule,
        batchRule: BatchCaslRule,
        categoryRule: CategoryCaslRule,
        ownershipTransferRule: OwnershipTransferCaslRule,
        productRule: ProductCaslRule,
        productModelRule: ProductModelCaslRule,
        shipmentRule: ShipmentCaslRule,
        supplierRule: SupplierCaslRule,
        returnRule: ReturnCaslRule,
        customerRule: CustomerCaslRule,
        inventoryRule: InventoryCaslRule,
        adminKpiCaslRule: AdminKpiCaslRule,

      ): CaslRuleBuilder[] => [
        saleRule,
        userRule,
        batchRule,
        categoryRule,
        ownershipTransferRule,
        productRule,
        productModelRule,
        shipmentRule,
        supplierRule,
        returnRule,
        customerRule,
        inventoryRule,
        adminKpiCaslRule
      ],
      inject: [
        SaleCaslRule,
        UserCaslRule,
        BatchCaslRule,
        CategoryCaslRule,
        OwnershipTransferCaslRule,
        ProductCaslRule,
        ProductModelCaslRule,
        ShipmentCaslRule,
        SupplierCaslRule,
        ReturnCaslRule,
        CustomerCaslRule,
        InventoryCaslRule,
        AdminKpiCaslRule
      ]
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard
    }
  ],
  exports: [CaslAbilityFactory, 'CASL_RULE_BUILDERS']
})
export class AppModule {}
