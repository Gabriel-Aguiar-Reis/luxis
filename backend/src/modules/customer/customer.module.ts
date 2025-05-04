import { Module } from '@nestjs/common'
import { CustomerController } from '@/modules/customer/presentation/customer.controller'
import { CreateCustomerUseCase } from '@/modules/customer/application/use-cases/create-customer.use-case'
import { GetAllCustomersUseCase } from '@/modules/customer/application/use-cases/get-all-customer.use-case'
import { DeleteCustomerUseCase } from '@/modules/customer/application/use-cases/delete-customer.use-case'
import { GetOneCustomersUseCase } from '@/modules/customer/application/use-cases/get-one-customer.use-case'
import { UpdateCustomerUseCase } from '@/modules/customer/application/use-cases/update-customer.use-case'
import { TransferCustomerUseCase } from '@/modules/customer/application/use-cases/transfer-customer.use-case'
import { CustomerTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer/customer.typeorm.repository'
import { CustomerPortfolioTypeOrmRepository } from '@/shared/infra/persistence/typeorm/customer-portfolio/customer-portfolio.typeorm.repository'
import { CustomerPortfolioService } from '@/modules/customer-portfolio/application/services/customer-portfolio.service'

@Module({
  controllers: [CustomerController],
  providers: [
    CreateCustomerUseCase,
    GetAllCustomersUseCase,
    GetOneCustomersUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    TransferCustomerUseCase,
    { provide: 'CustomerRepository', useClass: CustomerTypeOrmRepository },
    {
      provide: 'CustomerPortfolioRepository',
      useClass: CustomerPortfolioTypeOrmRepository
    },
    { provide: 'CustomerPortfolioService', useClass: CustomerPortfolioService }
  ]
})
export class CustomerModule {}
