import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppConfigService } from '@/shared/config/app-config.service'

export const databaseConfig = (
  appConfigService: AppConfigService
): TypeOrmModuleOptions => {
  const env = appConfigService.getNodeEnv()

  const entities = []

  switch (env) {
    case 'production':
      return {
        type: 'postgres',
        url: appConfigService.getDatabaseUrl(),
        entities,
        synchronize: false,
        ssl: { rejectUnauthorized: false }
      }

    case 'development':
      return {
        type: 'postgres',
        host: process.env.DB_HOST,
        port: parseInt(process.env.DB_PORT ?? '5432'),
        username: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_NAME,
        entities,
        synchronize: true
      }

    case 'test':
      return {
        type: 'sqlite',
        database: 'test.sqlite',
        entities,
        synchronize: true
      }
  }
}
