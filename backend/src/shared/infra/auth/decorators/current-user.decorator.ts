import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { createParamDecorator, ExecutionContext } from '@nestjs/common'

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): UserPayload => {
    const request = ctx.switchToHttp().getRequest()
    return request.user
  }
)
