import { AppConfigService } from '@/shared/config/app-config.service'
import { ConfigModule } from '@/shared/config/config.module'
import { databaseConfig } from '@/shared/config/database.config'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig
    }),
    TypeOrmModule.forFeature([])
  ],
  controllers: [],
  providers: [AppConfigService]
})
export class AppModule {}
