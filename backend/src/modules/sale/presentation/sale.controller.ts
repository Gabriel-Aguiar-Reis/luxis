import { CreateSaleUseCase } from '@/modules/sale/application/use-cases/create-sale.use-case'
import { DeleteSaleUseCase } from '@/modules/sale/application/use-cases/delete-sale.use-case'
import { GetAllSaleUseCase } from '@/modules/sale/application/use-cases/get-all-sale.use-case'
import { GetOneSaleUseCase } from '@/modules/sale/application/use-cases/get-one-sale.use-case'
import { UpdateSaleUseCase } from '@/modules/sale/application/use-cases/update-sale.use-case'
import { CreateSaleDto } from '@/modules/sale/presentation/dtos/create-sale.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  Get,
  UseGuards,
  Param,
  Patch,
  Delete
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('sales')
export class SaleController {
  constructor(
    private readonly createSaleUseCase: CreateSaleUseCase,
    private readonly getAllSaleUseCase: GetAllSaleUseCase,
    private readonly getOneSaleUseCase: GetOneSaleUseCase,
    private readonly updateSaleUseCase: UpdateSaleUseCase,
    private readonly deleteSaleUseCase: DeleteSaleUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN)
  @Get()
  async getAll() {
    return await this.getAllSaleUseCase.execute()
  }

  // TODO -> ABAC c/ CASL para reseller ver só suas sales e admin/sup ver tudo
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneSaleUseCase.execute(id)
  }

  // TODO -> ABAC c/ CASL para reseller vender só seus produtos e admin vender tudo
  @Post()
  async create(@Body() dto: CreateSaleDto) {
    return await this.createSaleUseCase.execute(dto)
  }

  // TODO -> ABAC c/ CASL para reseller editar só suas sales e admin/sup editar tudo
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: CreateSaleDto) {
    return await this.updateSaleUseCase.execute(id, dto)
  }

  // TODO -> ABAC c/ CASL para reseller deletar só suas sales e admin/sup deletar tudo
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteSaleUseCase.execute(id)
  }
}
