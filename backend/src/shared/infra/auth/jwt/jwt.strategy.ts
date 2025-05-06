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
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: AppConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.getJwtSecret()
    })
  }

  async validate(payload: JwtPayload): Promise<UserPayload> {
    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
      status: payload.status
    }
  }
}
