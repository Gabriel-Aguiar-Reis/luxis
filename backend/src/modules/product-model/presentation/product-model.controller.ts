import { CreateProductModelUseCase } from '@/modules/product-model/application/use-cases/create-product-model.use-case'
import { DeleteProductModelUseCase } from '@/modules/product-model/application/use-cases/delete-product-model.use-case'
import { GetAllProductModelUseCase } from '@/modules/product-model/application/use-cases/get-all-product-model.use-case'
import { GetOneProductModelUseCase } from '@/modules/product-model/application/use-cases/get-one-product-model.use-case'
import { UpdateProductModelUseCase } from '@/modules/product-model/application/use-cases/update-product-model.use-case'
import { CreateProductModelDto } from '@/modules/product-model/presentation/dtos/create-product-model.dto'
import { UpdateProductModelDto } from '@/modules/product-model/presentation/dtos/update-product-model.dto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { Roles } from '@/shared/infra/auth/decorators/roles.decorator'
import { RolesGuard } from '@/shared/infra/auth/guards/roles.guard'
import {
  Controller,
  Post,
  Body,
  UseGuards,
  Patch,
  Param,
  Delete,
  Get
} from '@nestjs/common'
import { UUID } from 'crypto'

@Controller('product-models')
export class ProductModelController {
  constructor(
    private readonly createProductModelUseCase: CreateProductModelUseCase,
    private readonly updateProductModelUseCase: UpdateProductModelUseCase,
    private readonly deleteProductModelUseCase: DeleteProductModelUseCase,
    private readonly getAllProductModelUseCase: GetAllProductModelUseCase,
    private readonly getOneProductModelUseCase: GetOneProductModelUseCase
  ) {}

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get()
  async getAll() {
    return await this.getAllProductModelUseCase.execute()
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Get(':id')
  async getOne(@Param('id') id: UUID) {
    return await this.getOneProductModelUseCase.execute(id)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Post()
  async create(@Body() dto: CreateProductModelDto) {
    return await this.createProductModelUseCase.execute(dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Patch(':id')
  async update(@Param('id') id: UUID, @Body() dto: UpdateProductModelDto) {
    return await this.updateProductModelUseCase.execute(id, dto)
  }

  @UseGuards(RolesGuard)
  @Roles(Role.ADMIN, Role.ASSISTANT)
  @Delete(':id')
  async delete(@Param('id') id: UUID) {
    return await this.deleteProductModelUseCase.execute(id)
  }
}
