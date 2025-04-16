import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm'

@Entity('product_models')
export class ProductModelOrmEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  category: string

  @Column({ nullable: true })
  description: string
}
