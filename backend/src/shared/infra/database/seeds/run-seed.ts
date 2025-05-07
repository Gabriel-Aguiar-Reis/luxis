import { NestFactory } from '@nestjs/core'
import { SeedsModule } from '@/shared/infra/database/seeds/seeds.module'
import { SuperuserSeed } from '@/shared/infra/database/seeds/superuser.seed'

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(SeedsModule)

  try {
    const superuserSeed = app.get(SuperuserSeed)
    await superuserSeed.run()
    console.log('Superuser seed completed successfully')
  } catch (error) {
    console.error('Error running superuser seed:', error)
  } finally {
    await app.close()
  }
}

bootstrap()
