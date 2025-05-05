import { Module } from '@nestjs/common'
import { CloudinaryService } from '@/shared/infra/cloudinary/cloudinary.service'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [ConfigModule],
  providers: [CloudinaryService]
})
export class CloudinaryModule {}
