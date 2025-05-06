import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppConfigService } from '@/shared/config/app-config.service'

export const databaseConfig = (
  appConfigService: AppConfigService
): TypeOrmModuleOptions => {
  const env = appConfigService.getNodeEnv()

  const entities = [__dirname + '/../**/*.entity{.ts,.js}']

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
        host: appConfigService.getDatabaseHost(),
        port: appConfigService.getDatabasePort(),
        username: appConfigService.getDatabaseUser(),
        password: appConfigService.getDatabasePassword(),
        database: appConfigService.getDatabaseName(),
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

    default:
      throw new Error(`Unknown NODE_ENV: ${env}`)
  }
}
