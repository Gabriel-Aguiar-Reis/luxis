import { NestFactory } from '@nestjs/core'
// import { GlobalExceptionFilter } from '@/presentation/filters/http-exceptions.filter'
import { Logger } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { AppConfigService } from '@/shared/config/app-config.service'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: ['log', 'warn', 'error', 'debug', 'verbose']
  })

  // app.useGlobalFilters(new GlobalExceptionFilter())

  const config = app.get(AppConfigService)
  const port = config.getPort() ?? 3000
  app.enableCors({ origin: '*' })

  await app.listen(port)
  Logger.log(`App running on http://localhost:${port}`, 'Bootstrap')
}
bootstrap()
