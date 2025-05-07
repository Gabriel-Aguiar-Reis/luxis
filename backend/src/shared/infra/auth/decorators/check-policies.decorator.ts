import { PolicyHandler } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { SetMetadata } from '@nestjs/common'

export const CHECK_POLICIES_KEY = 'check_policies'
export const CheckPolicies = (...handlers: PolicyHandler[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
