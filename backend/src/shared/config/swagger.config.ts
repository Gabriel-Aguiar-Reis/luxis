import { DocumentBuilder } from '@nestjs/swagger'

export const swaggerConfig = new DocumentBuilder()
  .setTitle('Luxis API')
  .setDescription('System API for Luxis')
  .setVersion('1.0')
  .addBearerAuth()
  .build()

export const swaggerOptions = {
  extraModels: [],
  deepScanRoutes: true,
  ignoreGlobalPrefix: true,
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey
}
