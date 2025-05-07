import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'
import { IPolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { Batch } from '@/modules/batch/domain/entities/batch.entity'
import { Actions } from '@/shared/infra/auth/enums/actions.enum'
import { Injectable } from '@nestjs/common'

@Injectable()
export class UpdateBatchPolicy implements IPolicyHandler {
  handle(ability: AppAbility): boolean {
    return ability.can(Actions.Update, Batch)
  }
}
