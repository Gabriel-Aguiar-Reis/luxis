import { Controller, Get } from '@nestjs/common'
import { AppConfigService } from '@/shared/config/app-config.service'

@Controller()
export class AppController {
  constructor(private readonly config: AppConfigService) {}

  @Get()
  root() {
    return {
      status: 'ok',
      service: 'luxis-backend',
      environment: this.config.getNodeEnv()
    }
  }

  @Get('health')
  health() {
    return {
      status: 'ok',
      environment: this.config.getNodeEnv(),
      timestamp: new Date().toISOString()
    }
  }
}
