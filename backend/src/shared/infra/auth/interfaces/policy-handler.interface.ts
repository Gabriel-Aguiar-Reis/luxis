import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'

export interface IPolicy {
  handle(ability: AppAbility): boolean
}

export type PolicyCallback = (ability: AppAbility) => boolean

export type Policy = IPolicy | PolicyCallback
