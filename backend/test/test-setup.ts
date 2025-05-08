import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { testDataSource } from './test-datasource'
import { faker } from '@faker-js/faker'
import { faker as fakerBr } from '@faker-js/faker/locale/pt_BR'
import { UUID } from 'crypto'
import { PasswordHash } from '@/modules/user/domain/value-objects/password-hash.vo'
import { Password } from '@/modules/user/domain/value-objects/password.vo'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'

export async function setupTestDatabase() {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('❌ setupTestDatabase only can be used with NODE_ENV=test')
  }

  if (!testDataSource.isInitialized) {
    await testDataSource.initialize()
  }

  const userRepository = testDataSource.getRepository(UserTypeOrmEntity)

  await userRepository.delete({})

  const users: UserTypeOrmEntity[] = []

  for (let i = 0; i < 5; i++) {
    const password = faker.internet.password({
      length: 10,
      pattern:
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d\s"'`;=\\-]).{10,}$/
    })

    const passwordHash = PasswordHash.generate(
      new Password(password)
    ).getValue()

    const user = userRepository.create({
      id: faker.string.uuid() as UUID,
      name: faker.person.firstName(),
      surName: faker.person.lastName(),
      phone: fakerBr.phone.number(),
      email: faker.internet.email(),
      passwordHash,
      role: faker.helpers.arrayElement(Object.values(Role)),
      residence: faker.location.streetAddress(true),
      status: faker.helpers.arrayElement(Object.values(UserStatus))
    })

    users.push(userRepository.create(user))
  }

  return {
    users,
    dataSource: testDataSource
  }

  // Initialize the test database connection
  // await testDataSource.initialize()
  // await testDataSource.synchronize(true)
  // await testDataSource.query('PRAGMA foreign_keys=OFF')
  // await testDataSource.query('PRAGMA foreign_keys=ON')
  // await testDataSource.query('PRAGMA foreign_keys=OFF')
  // await testDataSource.query('PRAGMA foreign_keys=ON')
}
