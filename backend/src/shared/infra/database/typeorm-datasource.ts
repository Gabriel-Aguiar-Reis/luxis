import { DataSource } from 'typeorm'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { ProductTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product/product.typeorm.entity'
import { ShipmentTypeOrmEntity } from '@/shared/infra/persistence/typeorm/shipment/shipment.typeorm.entity'
import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { OwnershipTransferTypeOrmEntity } from '@/shared/infra/persistence/typeorm/ownership-transfer/ownership-transfer.typeorm.entity'
import { SaleTypeOrmEntity } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.entity'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'
import { CategoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/category/category.typeorm.entity'
import { ProductModelTypeOrmEntity } from '@/shared/infra/persistence/typeorm/product-model/product-model.typeorm.entity'
import { SupplierTypeOrmEntity } from '@/shared/infra/persistence/typeorm/supplier/supplier.typeorm.entity'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { CreateUsers1712938000000 } from '@/shared/infra/database/migrations/1712938000000-create-users'
import { CreateProducts1712938000001 } from '@/shared/infra/database/migrations/1712938000001-create-products'
import { CreateCategories1712938000002 } from '@/shared/infra/database/migrations/1712938000002-create-categories'
import { CreateProductModels1712938000003 } from '@/shared/infra/database/migrations/1712938000003-create-product-models'
import { CreateBatches1712938000004 } from '@/shared/infra/database/migrations/1712938000004-create-batches'
import { CreateSales1712938000005 } from '@/shared/infra/database/migrations/1712938000005-create-sales'
import { CreateOwnershipTransfers1712938000006 } from '@/shared/infra/database/migrations/1712938000006-create-ownership-transfers'
import { CreateInventory1712938000007 } from '@/shared/infra/database/migrations/1712938000007-create-inventory'
import { CreateShipments1712938000008 } from '@/shared/infra/database/migrations/1712938000008-create-shipments'
import { CreateSuppliers1712938000009 } from '@/shared/infra/database/migrations/1712938000009-create-suppliers'

const commonConfig = {
  entities: [
    UserTypeOrmEntity,
    ProductTypeOrmEntity,
    ShipmentTypeOrmEntity,
    InventoryTypeOrmEntity,
    OwnershipTransferTypeOrmEntity,
    SaleTypeOrmEntity,
    BatchTypeOrmEntity,
    CategoryTypeOrmEntity,
    ProductModelTypeOrmEntity,
    SupplierTypeOrmEntity
  ],
  migrations: [
    CreateUsers1712938000000,
    CreateProducts1712938000001,
    CreateCategories1712938000002,
    CreateProductModels1712938000003,
    CreateBatches1712938000004,
    CreateSales1712938000005,
    CreateOwnershipTransfers1712938000006,
    CreateInventory1712938000007,
    CreateShipments1712938000008,
    CreateSuppliers1712938000009
  ],
  synchronize: false,
  namingStrategy: new SnakeNamingStrategy()
}

let AppDataSource: DataSource

switch (process.env.NODE_ENV) {
  case 'development':
    AppDataSource = new DataSource({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'luxis_dev',
      ...commonConfig
    })
    break

  case 'test':
    AppDataSource = new DataSource({
      type: 'sqlite',
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
    throw new Error(`Unknown NODE_ENV: ${process.env.NODE_ENV}`)
}

export { AppDataSource }
