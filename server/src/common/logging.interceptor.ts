import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from "@nestjs/common"
import type { Request, Response } from "express"
import { tap } from "rxjs"

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
  private readonly logger = new Logger("http")

  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    const started = Date.now()
    const path = request.path.split("?")[0] ?? request.path
    return next.handle().pipe(
      tap({
        next: () => {
          this.logger.log(`${request.method} ${path} ${response.statusCode} ${Date.now() - started}ms`)
        },
        error: () => {
          this.logger.warn(`${request.method} ${path} ${response.statusCode || 0} ${Date.now() - started}ms`)
        },
      }),
    )
  }
}
