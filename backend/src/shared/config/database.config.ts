import { TypeOrmModuleOptions } from '@nestjs/typeorm'
import { AppConfigService } from '@/shared/config/app-config.service'
import { BadRequestException } from '@nestjs/common'
import * as sqlite3 from 'sqlite3'

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
        driver: sqlite3,
        database: ':memory:',
        entities,
        synchronize: true,
        dropSchema: true
      }

    default:
      throw new BadRequestException(`Unknown NODE_ENV: ${env}`)
  }
}
