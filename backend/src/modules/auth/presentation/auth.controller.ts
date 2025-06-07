import {
  Body,
  Controller,
  Post,
  Get,
  Query,
  Res,
  UseInterceptors,
  Headers,
  UnauthorizedException
} from '@nestjs/common'
import { AuthService } from '@/modules/auth/application/services/auth.service'
import { LoginDto } from '@/modules/auth/application/dtos/login.dto'
import {
  ApiOperation,
  ApiBody,
  ApiResponse,
  ApiTags,
  ApiQuery
} from '@nestjs/swagger'
import { RequestPasswordResetDto } from '@/modules/auth/application/dtos/request-password-reset-dto'
import { ResetPasswordDto } from '@/modules/auth/application/dtos/reset-password.dto'
import { Email } from '@/shared/common/value-object/email.vo'
import { Response } from 'express'
import { readFileSync } from 'fs'
import { join } from 'path'
import { ServeStaticInterceptor } from '@/shared/infra/interceptors/serve-static.interceptor'
import { CustomLogger } from '@/shared/infra/logging/logger.service'

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
    private readonly logger: CustomLogger
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiBody({ type: LoginDto })
  @ApiResponse({ status: 200, description: 'Login successful' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @Post('login')
  async login(@Body() dto: LoginDto) {
    this.logger.log(
      `Login request received for user ${dto.email}`,
      'AuthController'
    )
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

  @ApiOperation({ summary: 'Verify JWT token' })
  @ApiResponse({ status: 200, description: 'Token is valid' })
  @ApiResponse({ status: 401, description: 'Unauthorized - Invalid token' })
  @Get('verify')
  async verify(@Headers('authorization') authHeader: string) {
    try {
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        throw new UnauthorizedException('Invalid token format')
      }
      
      const token = authHeader.split(' ')[1]
      const userData = await this.authService.verifyToken(token)
      
      return {
        valid: true,
        user: userData
      }
    } catch (error) {
      this.logger.error(`Token verification failed: ${error.message}`, 'AuthController')
      throw new UnauthorizedException('Invalid token')
    }
  }
}
