import { Column, Entity, PrimaryColumn } from 'typeorm'
import { UUID } from 'crypto'
import { CategoryStatus } from '@/modules/category/domain/enums/category.enum'

@Entity('categories')
export class CategoryTypeOrmEntity {
  @PrimaryColumn('uuid')
  id: UUID

  @Column({ name: 'name' })
  name: string

  @Column({ name: 'description', nullable: true })
  description: string

  @Column('enum', { name: 'status', enum: CategoryStatus })
  status: CategoryStatus
}
