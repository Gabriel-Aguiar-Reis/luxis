import { CustomerController } from '@/modules/customer/presentation/customer.controller'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { GetAllCustomerUseCase } from '@/modules/customer/application/use-cases/get-all-customer.use-case'
import { DeleteCustomerUseCase } from '@/modules/customer/application/use-cases/delete-customer.use-case'
import { GetOneCustomerUseCase } from '@/modules/customer/application/use-cases/get-one-customer.use-case'
import { UpdateCustomerUseCase } from '@/modules/customer/application/use-cases/update-customer.use-case'
import { TransferCustomerUseCase } from '@/modules/customer/application/use-cases/transfer-customer.use-case'
import { CustomerTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.repository'
import { CustomerPortfolioTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.repository'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'
import { TypeOrmModule } from '@nestjs/typeorm'
import { CustomerTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.entity'
import { EventDispatcher } from '@/shared/events/event-dispatcher'
import { CustomLogger } from '@/shared/infra/logging/logger.service'
import { AppConfigService } from '@/shared/config/app-config.service'
import { CustomerPortfolioTypeOrmEntity } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.entity'
import { forwardRef, Module } from '@nestjs/common'
import { AppModule } from '@/app.module'
import { CaslAbilityFactory } from '@/shared/infra/auth/casl/casl-ability.factory'
import { CustomerCreatedHandler } from '@/modules/customer-portfolio/application/handlers/customer-created.handler'
import { CustomerDeletedHandler } from '@/modules/customer-portfolio/application/handlers/customer-deleted.handler'
import { CustomerTransferredHandler } from '@/modules/customer-portfolio/application/handlers/customer-transferred.handler'
@Module({
  imports: [
    TypeOrmModule.forFeature([
      CustomerTypeOrmEntity,
      CustomerPortfolioTypeOrmEntity
    ]),
    forwardRef(() => AppModule)
  ],
  controllers: [CustomerController],
  providers: [
    CustomLogger,
    AppConfigService,
    CreateCustomerUseCase,
    GetAllCustomerUseCase,
    GetOneCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    TransferCustomerUseCase,
    EventDispatcher,
    CustomerCreatedHandler,
    CustomerDeletedHandler,
    CustomerTransferredHandler,
    { provide: 'CustomerRepository', useClass: CustomerTypeOrmRepository },
    {
      provide: 'CustomerPortfolioRepository',
      useClass: CustomerPortfolioTypeOrmRepository
    },
    { provide: 'CustomerPortfolioService', useClass: CustomerPortfolioService },
    { provide: 'CaslAbilityFactory', useClass: CaslAbilityFactory }
  ]
})
export class CustomerModule {}
