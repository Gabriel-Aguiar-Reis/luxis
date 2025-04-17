import { CreatePackingListUseCase } from '@/modules/packing-list/application/use-cases/create-packing-list.use-case'
import { CreatePackingListDto } from '@/modules/packing-list/presentation/dtos/create-packing-list.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('packing-list')
export class ProductController {
  constructor(
    private readonly createPackingListUseCase: CreatePackingListUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreatePackingListDto) {
    const packingList = await this.createPackingListUseCase.execute(dto)
    return { ...packingList }
  }
}
