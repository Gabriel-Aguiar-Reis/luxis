import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { CreateUserDto } from '@/modules/user/presentation/dtos/create-user.dto'
import { Controller, Post, Body } from '@nestjs/common'

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto)
    return { ...user }
  }
}
