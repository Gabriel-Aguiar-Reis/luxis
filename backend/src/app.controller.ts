import { Controller, Get } from '@nestjs/common'
import { AppConfigService } from '@/shared/config/app-config.service'

@Controller()
export class AppController {
  constructor(private readonly config: AppConfigService) {}

  @Get('health')
  health() {
    return {
      status: 'ok',
      environment: this.config.getNodeEnv(),
      timestamp: new Date().toISOString()
    }
  }
}
