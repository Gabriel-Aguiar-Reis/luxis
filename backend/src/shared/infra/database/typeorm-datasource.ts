import { DataSource } from 'typeorm'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { InventoryProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory-product.typeorm.entity'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { SaleProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale-product.typeorm.entity'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { ReturnTypeOrmEntity } from '@/shared/infra/persistence/typeorm/return/return.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { ConfigService } from '@nestjs/config'
import * as dotenv from 'dotenv'
import { BadRequestException } from '@nestjs/common'
import { Init1749406833692 } from '@/shared/infra/database/migrations/1749406833692-Init'
import { AddPerformanceIndexes1749500000000 } from '@/shared/infra/database/migrations/1749500000000-AddPerformanceIndexes'
import { PasswordResetRequestTypeOrmEntity } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/password-reset-requests.typeorm.entity'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { CustomerPortfolioCustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio-customer.typeorm.entity'
import { FixMissingColumnsAndTables1774483200000 } from '@/shared/infra/database/migrations/1774483200000-FixMissingColumnsAndTables'
import { PersistSaleInstallments1789078500000 } from '@/shared/infra/database/migrations/1789078500000-PersistSaleInstallments'
import { CreateSaleProducts1789078600000 } from '@/shared/infra/database/migrations/1789078600000-CreateSaleProducts'
import { CreateInventoryAndPortfolioRelations1789078700000 } from '@/shared/infra/database/migrations/1789078700000-CreateInventoryAndPortfolioRelations'
dotenv.config({ path: '.env.development' })

const commonConfig = {
  entities: [
    UserTypeOrmEntity,
    ProductTypeOrmEntity,
    ShipmentTypeOrmEntity,
    InventoryTypeOrmEntity,
    InventoryProductTypeOrmEntity,
    OwnershipTransferTypeOrmEntity,
    SaleTypeOrmEntity,
    SaleProductTypeOrmEntity,
    BatchTypeOrmEntity,
    CategoryTypeOrmEntity,
    ProductModelTypeOrmEntity,
    SupplierTypeOrmEntity,
    ReturnTypeOrmEntity,
    PasswordResetRequestTypeOrmEntity,
    CustomerTypeOrmEntity,
    CustomerPortfolioTypeOrmEntity,
    CustomerPortfolioCustomerTypeOrmEntity
  ],
  migrations: [
    Init1749406833692,
    AddPerformanceIndexes1749500000000,
    FixMissingColumnsAndTables1774483200000,
    PersistSaleInstallments1789078500000,
    CreateSaleProducts1789078600000,
    CreateInventoryAndPortfolioRelations1789078700000
  ],
  synchronize: false
}

let AppDataSource: DataSource

let appConfigService = new AppConfigService(new ConfigService())

switch (appConfigService.getNodeEnv()) {
  case 'development':
    AppDataSource = new DataSource({
      type: 'postgres',
      host: appConfigService.getDatabaseHost(),
      port: appConfigService.getDatabasePort(),
      username: appConfigService.getDatabaseUser(),
      password: appConfigService.getDatabasePassword(),
      database: appConfigService.getDatabaseName(),
      ...commonConfig
    })
    break

  case 'test':
    // Loaded lazily so production (Postgres) never requires the native sqlite3 binary
    AppDataSource = new DataSource({
      type: 'better-sqlite3',
      database: 'test.sqlite',
      ...commonConfig
    })
    break

  case 'production':
    AppDataSource = new DataSource({
      type: 'postgres',
      url: process.env.DATABASE_URL,
      ssl: {
        rejectUnauthorized: false
      },
      migrationsRun: true,
      ...commonConfig
    })
    break

  default:
    throw new BadRequestException(`Unknown NODE_ENV: ${process.env.NODE_ENV}`)
}

export { AppDataSource }
