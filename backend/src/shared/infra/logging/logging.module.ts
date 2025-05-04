import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { Module } from '@nestjs/common'
import { AppConfigService } from '@/shared/config/app-config.service'

@Module({
  providers: [
    {
      provide: 'Logger',
      useClass: CustomLogger
    },
    AppConfigService
  ]
})
export class LoggingModule {}
