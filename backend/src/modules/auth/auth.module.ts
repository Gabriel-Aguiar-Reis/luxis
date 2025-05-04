import { Module } from '@nestjs/common'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { JwtStrategy } from '@/shared/infra/auth/jwt/jwt.strategy'
import { UserModule } from '@/modules/user/user.module'
import { AppConfigService } from '@/shared/config/app-config.service'
import { AuthController } from '@/modules/auth/presentation/auth.controller'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.getJwtSecret(),
        signOptions: { expiresIn: config.getJwtExpirationTime() }
      })
    })
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy]
})
export class AuthModule {}
