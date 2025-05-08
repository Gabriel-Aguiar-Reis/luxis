import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { DataSource } from 'typeorm'

export const testDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [UserTypeOrmEntity],
  synchronize: true,
  logging: false
})
