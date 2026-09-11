import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { HttpAdapterHost } from '@nestjs/core'
import { AppConfigService } from '@/shared/config/app-config.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor(
    private readonly appConfigService: AppConfigService,
    private readonly httpAdapterHost: HttpAdapterHost
  ) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost
    const ctx = host.switchToHttp()
    const request = ctx.getRequest()
    const response = ctx.getResponse()

    let status = HttpStatus.INTERNAL_SERVER_ERROR
    let message = 'Internal server error'
    let error = 'Internal Server Error'

    if (exception instanceof HttpException) {
      status = exception.getStatus()
      const exceptionResponse = exception.getResponse()
      message =
        typeof exceptionResponse === 'string'
          ? exceptionResponse
          : exceptionResponse['message'] || exception.message
      error = exception.name
    } else if (exception instanceof Error) {
      message = exception.message
      error = exception.name
    }

    const responseBody = {
      statusCode: status,
      message,
      error,
      timestamp: new Date().toISOString(),
      path: request?.url
    }

    if (!this.appConfigService.isProduction()) {
      ;(responseBody as any)['stack'] =
        exception instanceof Error ? exception.stack : undefined
    }

    this.logger.error(
      `Error: ${message} - Path: ${request?.url} - Status: ${status}`,
      exception instanceof Error ? exception.stack : undefined
    )

    httpAdapter.reply(response, responseBody, status)
  }
}
