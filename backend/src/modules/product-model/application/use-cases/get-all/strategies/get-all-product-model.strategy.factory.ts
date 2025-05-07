import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { BadRequestException, Injectable } from '@nestjs/common'
import { GetAllProductModelStrategy } from './get-all-product-model.strategy'
import { GetAllProductModelAdminStrategy } from './get-all-product-model-admin.strategy'
import { GetAllProductModelResellerStrategy } from './get-all-product-model-reseller.strategy'
import { GetAllProductModelAssistantStrategy } from './get-all-product-model-assistant.strategy'
import { Role } from '@/modules/user/domain/enums/user-role.enum'

@Injectable()
export class GetAllProductModelStrategyFactory {
  constructor(
    private readonly adminStrategy: GetAllProductModelAdminStrategy,
    private readonly resellerStrategy: GetAllProductModelResellerStrategy,
    private readonly assistantStrategy: GetAllProductModelAssistantStrategy
  ) {}

  create(user: UserPayload): GetAllProductModelStrategy {
    switch (user.role) {
      case Role.ADMIN:
        return this.adminStrategy
      case Role.RESELLER:
        return this.resellerStrategy
      case Role.ASSISTANT:
        return this.assistantStrategy
      default:
        throw new BadRequestException('Invalid role')
    }
  }
}
