import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create/create-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one/get-one-sale.use-case'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update/update-sale.use-case'
import { SaleController } from '@/modules/sale/presentation/sale.controller'
import { Module } from '@nestjs/common'

// TODO -> Preciso colocar as implementações concretas para todos os tokens deste module
@Module({
  controllers: [SaleController],
  providers: [
    CreateSaleUseCase,
    GetOneSaleUseCase,
    GetAllSaleUseCase,
    UpdateSaleUseCase,
    DeleteSaleUseCase
  ]
})
export class SaleModule {}
