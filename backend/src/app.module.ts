import { AppConfigService } from '@/shared/config/app-config.service'
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
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
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

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig
    }),
    TypeOrmModule.forFeature([]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    }),
    BatchModule,
    CategoryModule,
    OwnershipTransferModule,
    ProductModule,
    ProductModelModule,
    SaleModule,
    ShipmentModule,
    UserModule,
    SupplierModule
  ],
  controllers: [],
  providers: [
    AppConfigService,
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
        supplierRule: SupplierCaslRule
      ): CaslRuleBuilder[] => [
        saleRule,
        userRule,
        batchRule,
        categoryRule,
        ownershipTransferRule,
        productRule,
        productModelRule,
        shipmentRule,
        supplierRule
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
        SupplierCaslRule
      ]
    }
  ],
  exports: [JwtModule, CaslAbilityFactory]
})
export class AppModule {}
