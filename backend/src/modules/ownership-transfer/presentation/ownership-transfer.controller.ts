import { CreateOwnershipTransferUseCase } from '@/modules/ownership-transfer/application/use-cases/create-ownership-transfer.use-case'
import { CreateOwnershipTransferDto } from '@/modules/ownership-transfer/presentation/dtos/create-ownership-transfer.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('ownership-transfers')
export class OwnershipTransfersController {
  constructor(
    private readonly createOwnershipTransferUseCase: CreateOwnershipTransferUseCase
  ) {}

  @Post()
  async create(@Body() dto: CreateOwnershipTransferDto) {
    return await this.createOwnershipTransferUseCase.execute(dto)
  }
}
