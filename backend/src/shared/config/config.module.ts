import { validateEnv } from '@/shared/config/env.validation'
import { Module } from '@nestjs/common'
import { ConfigModule as NestConfigModule } from '@nestjs/config'
import { AppConfigService } from '@/shared/config/app-config.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { databaseConfig } from '@/shared/config/database.config'

@Module({
  imports: [
    NestConfigModule.forRoot({
      isGlobal: true,
      validate: validateEnv,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: databaseConfig
    })
  ],
  providers: [AppConfigService],
  exports: [AppConfigService]
})
export class ConfigModule {}
