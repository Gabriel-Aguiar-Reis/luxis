import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Res,
  UseInterceptors
} from '@nestjs/common'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { LoginDto } from '@/modules/auth/presentation/dtos/login.dto'
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino'
import { RequestPasswordResetDto } from '@/modules/auth/presentation/dtos/request-password-reset-dto'
import { ResetPasswordDto } from '@/modules/auth/presentation/dtos/reset-password.dto'
import { Email } from '@/shared/common/value-object/email.vo'
import { Response } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import { ServeStaticInterceptor } from '@/shared/infra/interceptors/serve-static.interceptor'

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  private readonly templatesPath = join(
    process.cwd(),
    'src',
    'modules',
    'auth',
    'presentation',
    'templates',
    'reset-password'
  )

  constructor(
    private readonly authService: AuthService,
    @InjectPinoLogger(AuthController.name)
    private readonly logger: PinoLogger
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.info('Login request received', dto)
    return await this.authService.login(dto)
  }

  @ApiOperation({ summary: 'Forgot password' })
  @ApiBody({ type: RequestPasswordResetDto })
  @ApiResponse({ status: 200, description: 'Forgot password successful' })
  @ApiResponse({ status: 404, description: 'User not found' })
  @Post('forgot-password')
  async forgotPassword(@Body() dto: RequestPasswordResetDto): Promise<void> {
    return this.authService.forgotPassword(new Email(dto.email))
  }

  @ApiOperation({ summary: 'Reset password' })
  @ApiBody({ type: ResetPasswordDto })
  @ApiResponse({ status: 200, description: 'Password reset successful' })
  @ApiResponse({ status: 400, description: 'Invalid or expired token' })
  @Post('reset-password')
  async resetPassword(@Body() dto: ResetPasswordDto): Promise<void> {
    await this.authService.resetPassword(dto.token, dto.newPassword)
  }

  @ApiOperation({ summary: 'Reset password page (Development only)' })
  @ApiQuery({
    name: 'token',
    required: true,
    description: 'Reset password token'
  })
  @Get('reset-password-page')
  async resetPasswordPage(@Query('token') token: string, @Res() res: Response) {
    const template = readFileSync(
      join(this.templatesPath, 'template.html'),
      'utf-8'
    )
    res.send(template.replace('{{token}}', token))
  }

  @UseInterceptors(ServeStaticInterceptor)
  @Get('reset-password-page/styles.css')
  async getStyles(@Res() res: Response) {
    res.sendFile(join(this.templatesPath, 'styles.css'))
  }

  @UseInterceptors(ServeStaticInterceptor)
  @Get('reset-password-page/script.js')
  async getScript(@Res() res: Response) {
    res.sendFile(join(this.templatesPath, 'script.js'))
  }
}
