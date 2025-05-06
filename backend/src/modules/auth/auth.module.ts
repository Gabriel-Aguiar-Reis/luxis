import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { JwtStrategy } from '@/shared/infra/auth/jwt/jwt.strategy'
import { UserModule } from '@/modules/user/user.module'
import { AppConfigService } from '@/shared/config/app-config.service'
import { AuthController } from '@/modules/auth/presentation/auth.controller'
import { ConfigModule } from '@/shared/config/config.module'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { UserTypeOrmEntity } from '@/shared/infra/persistence/typeorm/user/user.typeorm.entity'
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.getJwtSecret(),
        signOptions: { expiresIn: config.getJwtExpirationTime() }
      })
    }),
    TypeOrmModule.forFeature([UserTypeOrmEntity])
  ],
  controllers: [AuthController],
  providers: [
    CustomLogger,
    AppConfigService,
    AuthService,
    JwtStrategy,
    { provide: 'UserRepository', useClass: UserTypeOrmRepository }
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
