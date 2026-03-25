import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { ExtractJwt, Strategy } from 'passport-jwt'
import { UUID } from 'crypto'
import { Role } from '@/modules/user/domain/enums/user-role.enum'
import { UserPayload } from '@/shared/infra/auth/interfaces/user-payload.interface'
import { UserStatus } from '@/modules/user/domain/enums/user-status.enum'
import { AppConfigService } from '@/shared/config/app-config.service'

type JwtPayload = {
  sub: UUID
  email: string
  role: Role
  status: UserStatus
  name: string
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AppConfigService) {
    const cookieName = configService.getAuthCookieName()

    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        ExtractJwt.fromAuthHeaderAsBearerToken(),
        (request) => {
          const cookieHeader = request?.headers?.cookie

          if (!cookieHeader || typeof cookieHeader !== 'string') {
            return null
          }

          const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())
          const tokenCookie = cookies.find((cookie) =>
            cookie.startsWith(`${cookieName}=`)
          )

          if (!tokenCookie) {
            return null
          }

          return decodeURIComponent(tokenCookie.split('=').slice(1).join('='))
        }
      ]),
      secretOrKey: configService.getJwtSecret()
    })
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status,
      name: payload.name
    }
  }
}
