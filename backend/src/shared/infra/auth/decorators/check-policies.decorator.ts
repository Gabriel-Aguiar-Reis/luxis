import { Policy } from '@/shared/infra/auth/interfaces/policy-handler.interface'
import { SetMetadata } from '@nestjs/common'

export const CHECK_POLICIES_KEY = 'check_policies'
export const CheckPolicies = (...handlers: Policy[]) =>
  SetMetadata(CHECK_POLICIES_KEY, handlers)
