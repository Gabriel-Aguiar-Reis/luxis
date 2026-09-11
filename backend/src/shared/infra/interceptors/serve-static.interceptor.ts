import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler
} from '@nestjs/common'
import { Observable } from 'rxjs'

@Injectable()
export class ServeStaticInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<{ url: string }>()
    const response = context
      .switchToHttp()
      .getResponse<{ type: (contentType: string) => unknown }>()
    response.type(this.getContentType(request.url))
    return next.handle()
  }

  private getContentType(url: string): string {
    if (url.endsWith('.css')) return 'text/css'
    if (url.endsWith('.js')) return 'application/javascript'
    return 'text/plain'
  }
}
