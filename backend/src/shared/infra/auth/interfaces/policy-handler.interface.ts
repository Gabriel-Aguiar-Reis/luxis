import { AppAbility } from '@/shared/infra/auth/casl/casl-ability.factory'

export interface IPolicyHandler {
  handle(ability: AppAbility): boolean
}

export type PolicyHandlerCallback = (ability: AppAbility) => boolean

export type PolicyHandler = IPolicyHandler | PolicyHandlerCallback
