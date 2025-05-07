import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger
} from '@nestjs/common'
import { Response } from 'express'
import { AppConfigService } from '@/shared/config/app-config.service'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalExceptionFilter.name)

  constructor(private readonly appConfigService: AppConfigService) {}

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp()
    const response = ctx.getResponse<Response>()
    const request = ctx.getRequest<Request>()

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
      path: request.url
    }

    if (!this.appConfigService.isProduction()) {
      responseBody['stack'] =
        exception instanceof Error ? exception.stack : undefined
    }

    this.logger.error(
      `Error: ${message} - Path: ${request.url} - Status: ${status}`,
      exception instanceof Error ? exception.stack : undefined
    )

    response.status(status).json(responseBody)
  }
}
