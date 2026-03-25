/**
 * Script para gerar o OpenAPI spec sem conexão com banco de dados.
 * Intercepta DataSource.initialize para ignorar a conexão real.
 * Uso: npm run generate:spec
 */

// Deve ser feito ANTES de qualquer import que use TypeORM
// eslint-disable-next-line @typescript-eslint/no-require-imports
const typeorm = require('typeorm')
const originalInitialize = typeorm.DataSource.prototype.initialize
typeorm.DataSource.prototype.initialize = async function () {
  this._isInitialized = true
  return this
}
typeorm.DataSource.prototype.destroy = async function () {
  this._isInitialized = false
  return this
}

import * as fs from 'fs'
import * as path from 'path'
import { NestFactory } from '@nestjs/core'
import { SwaggerModule } from '@nestjs/swagger'
import { AppModule } from '@/app.module'
import { swaggerConfig, swaggerOptions } from '@/shared/config/swagger.config'

async function generateSpec() {
  const app = await NestFactory.create(AppModule, {
    logger: false,
    abortOnError: false
  })

  const document = SwaggerModule.createDocument(
    app,
    swaggerConfig,
    swaggerOptions
  )

  const outputPath = path.resolve(__dirname, '../openapi.json')
  fs.writeFileSync(outputPath, JSON.stringify(document, null, 2))

  console.log(`✅ OpenAPI spec gerado em: ${outputPath}`)
  await app.close()
}

generateSpec()
  .then(() => {
    typeorm.DataSource.prototype.initialize = originalInitialize
    process.exit(0)
  })
  .catch((err) => {
    process.stderr.write(`❌ Erro ao gerar spec: ${err.message}\n`)
    process.exit(1)
  })
