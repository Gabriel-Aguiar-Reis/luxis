import { AppConfigService } from '@/shared/config/app-config.service'
import { ConfigModule } from '@/shared/config/config.module'
import { databaseConfig } from '@/shared/config/database.config'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CaslRuleBuilder } from '@/shared/infra/auth/casl/interfaces/casl-rules.builder'
import { SaleCaslRule } from '@/shared/infra/auth/casl/rules/sale.rules'
import { UserCaslRule } from '@/shared/infra/auth/casl/rules/user.rules'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import { JwtStrategy } from '@/shared/infra/auth/jwt/jwt.strategy'
import { Module } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { PassportModule } from '@nestjs/passport'
import { TypeOrmModule } from '@nestjs/typeorm'
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: databaseConfig
    }),
    TypeOrmModule.forFeature([]),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' }
    })
  ],
  controllers: [],
  providers: [
    AppConfigService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard
    },
    JwtStrategy,
    CaslAbilityFactory,
    SaleCaslRule,
    UserCaslRule,
    // ShipmentCaslRule,
    {
      provide: 'CASL_RULE_BUILDERS',
      useFactory: (
        saleRule: SaleCaslRule,
        userRule: UserCaslRule
        // shipmentRule: ShipmentCaslRule
      ): CaslRuleBuilder[] => [saleRule, userRule /*, shipmentRule */],
      inject: [SaleCaslRule, UserCaslRule /*, ShipmentCaslRule */]
    }
  ],
  exports: [JwtModule, CaslAbilityFactory]
})
export class AppModule {}
