import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@/shared/config/config.module'

@Module({
  imports: [ConfigModule],
  providers: [CustomLogger, AppConfigService],
  exports: [CustomLogger]
})
export class LoggingModule {}
