import { InventoryTypeOrmEntity } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.entity'
import { InventoryTypeOrmRepository } from '@/shared/infra/persistence/typeorm/inventory/inventory.typeorm.repository'
import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'

@Module({
  imports: [TypeOrmModule.forFeature([InventoryTypeOrmEntity])],
  providers: [
    { provide: 'InventoryRepository', useClass: InventoryTypeOrmRepository }
  ]
})
export class InventoryModule {}
