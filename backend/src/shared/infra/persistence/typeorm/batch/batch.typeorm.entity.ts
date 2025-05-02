import { BatchItemTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch-item.typeorm.entity'
import { UUID } from 'crypto'
import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm'

@Entity('batches')
export class BatchTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('timestamp')
  arrivalDate: Date

  @Column('uuid')
  supplierId: UUID

  @OneToMany(() => BatchItemTypeOrmEntity, (item) => item.batch)
  items: BatchItemTypeOrmEntity[]
}
