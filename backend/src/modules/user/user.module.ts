import { CreateUserUseCase } from '@/modules/user/application/use-cases/create-user.use-case'
import { GetOneUserUseCase } from '@/modules/user/application/use-cases/get-one-user.use-case'
import { UserController } from '@/modules/user/presentation/user.controller'
import { Module } from '@nestjs/common'
import { GetAllUserUseCase } from '@/modules/user/application/use-cases/get-all-user.use-case'
import { DeleteUserUseCase } from '@/modules/user/application/use-cases/delete-user.use-case'
import { UpdateUserUseCase } from '@/modules/user/application/use-cases/update-user.use-case'
import { DisableUserUseCase } from '@/modules/user/application/use-cases/disable-user.use-case'
import { UpdateUserRoleUseCase } from '@/modules/user/application/use-cases/update-user-role.use-case'
import { UserTypeOrmRepository } from '@/shared/infra/persistence/typeorm/user/user.typeorm.repository'

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    GetOneUserUseCase,
    GetAllUserUseCase,
    DeleteUserUseCase,
    UpdateUserUseCase,
    UpdateUserRoleUseCase,
    DisableUserUseCase,
    { provide: 'UserRepository', useClass: UserTypeOrmRepository }
  ]
})
export class UserModule {}
