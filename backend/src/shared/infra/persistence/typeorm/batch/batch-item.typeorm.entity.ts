import { Column, Entity, ManyToOne, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'
import { BatchTypeOrmEntity } from '@/shared/infra/persistence/typeorm/batch/batch.typeorm.entity'

@Entity('batch_items')
export class BatchItemTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column('uuid')
  modelId: UUID

  @Column('int')
  quantity: number

  @Column('decimal', { precision: 10, scale: 2 })
  unitCost: string

  @Column('decimal', { precision: 10, scale: 2 })
  salePrice: string

  @Column({ nullable: true })
  modelName: string

  @Column('uuid', { nullable: true })
  categoryId: UUID

  @ManyToOne(() => BatchTypeOrmEntity, (batch) => batch.items)
  batch: BatchTypeOrmEntity
}
