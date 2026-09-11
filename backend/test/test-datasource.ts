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

// Compatibilidade: TypeORM 1.x usa a função quote_ident em algumas queries
// internas; registrar uma versão simples para os testes no pg-mem.
testDb.public.registerFunction({
  name: 'quote_ident',
  args: [DataType.text],
  returns: DataType.text,
  implementation: (v: any) => String(v)
})

// Registrar também no schema pg_catalog, onde o Postgres normalmente expõe
// essa função, para compatibilidade com queries internas do TypeORM.
testDb.getSchema('pg_catalog').registerFunction({
  name: 'quote_ident',
  args: [DataType.text],
  returns: DataType.text,
  implementation: (v: any) => String(v)
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
