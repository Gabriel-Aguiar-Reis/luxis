import { NestFactory } from '@nestjs/core'
import { GlobalExceptionFilter } from '@/shared/infra/filters/http-exceptions.filter'
import { Logger } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { AppConfigService } from '@/shared/config/app-config.service'
import { Logger as PinoLogger } from 'nestjs-pino'
import { SwaggerModule } from '@nestjs/swagger'
import { swaggerConfig, swaggerOptions } from '@/shared/config/swagger.config'

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    bufferLogs: true
  })

  const config = app.get(AppConfigService)
  app.useGlobalFilters(new GlobalExceptionFilter(config))

  app.useLogger(app.get(PinoLogger))
  const port = config.getPort() ?? 3000
  app.enableCors({ origin: '*' })

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions
  )
  SwaggerModule.setup('api/docs', app, document)

  await app.listen(port)
  Logger.log(`App running on http://localhost:${port}`, 'Bootstrap')
  Logger.log(
    `Swagger docs available at http://localhost:${port}/api/docs`,
    'Bootstrap'
  )
}

bootstrap()
