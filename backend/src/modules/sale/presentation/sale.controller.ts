import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create-application.use-case'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('sales')
export class SaleController {
  constructor(private readonly createSaleUseCase: CreateSaleUseCase) {}

  @Post()
  async create(@Body() dto: CreateSaleDto) {
    return await this.createSaleUseCase.execute(dto)
  }
}
