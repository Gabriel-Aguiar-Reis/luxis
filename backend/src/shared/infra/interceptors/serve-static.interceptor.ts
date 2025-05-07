import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'
import { Response } from 'express'

@Injectable()
export class ServeStaticInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const response = context.switchToHttp().getResponse<Response>()
    response.setHeader('Content-Type', this.getContentType(response.req.url))
    return next.handle()
  }

  private getContentType(url: string): string {
    if (url.endsWith('.css')) return 'text/css'
    if (url.endsWith('.js')) return 'application/javascript'
    return 'text/plain'
  }
}
