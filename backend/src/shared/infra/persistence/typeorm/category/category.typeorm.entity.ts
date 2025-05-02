import { Column, Entity, PrimaryColumn } from 'typeorm'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'
import { UUID } from 'crypto'

@Entity('categories')
export class CategoryTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column()
  name: string

  @Column({ nullable: true })
  description: string

  @Column({
    type: 'enum',
    enum: CategoryStatus,
    default: CategoryStatus.ACTIVE
  })
  status: CategoryStatus
}
