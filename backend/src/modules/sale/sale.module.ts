import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { SaleTypeOrmRepository } from '@/shared/infra/persistence/typeorm/sale/sale.typeorm.repository'
import { Module } from '@nestjs/common'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { SalePriceCalculatorService } from '@/modules/sale/application/services/sale-price-calculator.service'
import { SaleController } from '@/modules/sale/presentation/sale.controller'
import { InventoryOwnershipVerifierService } from '@/modules/sale/application/services/inventory-ownership-verify.service'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update/update-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'

@Module({
  controllers: [SaleController],
  providers: [
    CreateSaleUseCase,
    GetOneSaleUseCase,
    GetAllSaleUseCase,
    UpdateSaleUseCase,
    DeleteSaleUseCase,
    { provide: 'SaleRepository', useClass: SaleTypeOrmRepository },
    { provide: 'SalePriceCalculator', useClass: SalePriceCalculatorService },
    {
      provide: 'InventoryOwnershipVerifier',
      useClass: InventoryOwnershipVerifierService
    }
  ]
})
export class SaleModule {}
