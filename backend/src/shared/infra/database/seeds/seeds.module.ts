import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SuperuserSeed } from '@/shared/infra/database/seeds/superuser.seed'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
import { AppConfigService } from '@/shared/config/app-config.service'
import { ConfigModule } from '@/shared/config/config.module'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'

@Module({
  imports: [TypeOrmModule.forFeature([UserTypeOrmEntity]), ConfigModule],
  providers: [
    SuperuserSeed,
    AppConfigService,
    { provide: 'UserRepository', useClass: UserTypeOrmRepository }
  ],
  exports: [SuperuserSeed]
})
export class SeedsModule {}
