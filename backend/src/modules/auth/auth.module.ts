import { forwardRef, Module } from '@nestjs/common'
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
import { EmailService } from '@/modules/auth/application/services/email.service'
import { RequestPasswordResetUseCase } from '@/modules/auth/application/use-cases/request-password-reset.use-case'
import { ListPasswordResetRequestsUseCase } from '@/modules/auth/application/use-cases/list-password-reset-requests.use-case'
import { ApprovePasswordResetRequestUseCase } from '@/modules/auth/application/use-cases/approve-password-reset-request.use-case'
import { RejectPasswordResetRequestUseCase } from '@/modules/auth/application/use-cases/reject-password-reset-request.use-case'
import { ResetPasswordUseCase } from '@/modules/auth/application/use-cases/reset-password.use-case'
import { PasswordResetRequestTypeOrmRepository } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/password-reset-requests.typeorm.repository'
import { PasswordResetRequestTypeOrmEntity } from '@/shared/infra/persistence/typeorm/auth/password-reset-requests/password-reset-requests.typeorm.entity'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { AppModule } from '@/app.module'

@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [AppConfigService],
      useFactory: (config: AppConfigService) => ({
        secret: config.getJwtSecret(),
        signOptions: { expiresIn: config.getJwtExpirationTime() as any }
      })
    }),
    TypeOrmModule.forFeature([
      UserTypeOrmEntity,
      PasswordResetRequestTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [AuthController],
  providers: [
    CustomLogger,
    AppConfigService,
    AuthService,
    JwtStrategy,
    EmailService,
    RequestPasswordResetUseCase,
    ListPasswordResetRequestsUseCase,
    ApprovePasswordResetRequestUseCase,
    RejectPasswordResetRequestUseCase,
    ResetPasswordUseCase,
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory },
    { provide: 'UserRepository', useClass: UserTypeOrmRepository },
    { provide: 'EmailService', useClass: EmailService },
    {
      provide: 'PasswordResetRequestRepository',
      useClass: PasswordResetRequestTypeOrmRepository
    }
  ],
  exports: [AuthService, JwtModule]
})
export class AuthModule {}
