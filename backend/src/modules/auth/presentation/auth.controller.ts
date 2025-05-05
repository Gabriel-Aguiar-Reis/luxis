import { Body, Controller, Logger, Post } from '@nestjs/common'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { LoginDto } from '@/modules/auth/presentation/dtos/login.dto'
import { ApiOperation, ApiBody, ApiResponse, ApiTags } from '@nestjs/swagger'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly logger: Logger
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.log('Login request received', dto)
    return await this.authService.login(dto)
  }
}
