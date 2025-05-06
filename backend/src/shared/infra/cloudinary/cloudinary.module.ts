import { Module } from '@nestjs/common'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { ConfigModule } from '@/shared/config/config.module'

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService]
})
export class CloudinaryModule {}
