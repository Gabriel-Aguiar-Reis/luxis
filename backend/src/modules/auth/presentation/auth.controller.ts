import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { LoginDto } from '@/modules/auth/presentation/dtos/login.dto'

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) {}

  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.log('Login request received', dto)
    return await this.authService.login(dto)
  }
}
