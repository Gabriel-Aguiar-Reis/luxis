import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { DataType, newDb } from 'pg-mem'
import { randomUUID } from 'crypto'

const testDb = newDb({ autoCreateForeignKeyIndices: true })

testDb.public.registerFunction({
  name: 'current_database',
  returns: DataType.text,
  implementation: () => 'luxis_test'
})

testDb.public.registerFunction({
  name: 'version',
  returns: DataType.text,
  implementation: () => 'PostgreSQL 14.0'
})

testDb.registerExtension('uuid-ossp', (schema) => {
  schema.registerFunction({
    name: 'uuid_generate_v4',
    returns: DataType.uuid,
    implementation: () => randomUUID()
  })
})

export const testDataSource = testDb.adapters.createTypeormDataSource({
  type: 'postgres',
  entities: [UserTypeOrmEntity],
  synchronize: true,
  logging: false
})
