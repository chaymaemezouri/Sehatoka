import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Logger } from "@nestjs/common"
import type { Response } from "express"
import { AppError } from "./app-error"

@Catch()
export class AppExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger("http")

  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>()
    if (exception instanceof AppError) {
      response.status(exception.status).json({ code: exception.code })
      return
    }
    if (exception instanceof HttpException) {
      const status = exception.getStatus()
      const code = status === 404 ? "missing" : status === 400 ? "invalid" : status === 429 ? "rate" : "unavailable"
      response.status(status).json({ code })
      return
    }
    const name = exception instanceof Error ? exception.name : "Error"
    this.logger.error(name)
    response.status(500).json({ code: "unavailable" })
  }
}
