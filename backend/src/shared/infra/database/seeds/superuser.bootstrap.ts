import { NestFactory } from '@nestjs/core'
import { SeedsModule } from '@/shared/infra/database/seeds/seeds.module'
import { SuperuserSeed } from '@/shared/infra/database/seeds/superuser.seed'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule)
  try {
    const result = await app.get(SuperuserSeed).run()
    console.log(`✅ Superuser created: ${result.email} (id: ${result.id})`)
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error)
    console.error('❌ Failed to create superuser:', message)
    process.exit(1)
  } finally {
    await app.close()
  }
}

bootstrap()
