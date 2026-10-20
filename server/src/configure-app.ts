import { ValidationPipe, type INestApplication } from "@nestjs/common"
import cookieParser from "cookie-parser"
import { json } from "express"
import helmet from "helmet"
import { AppError } from "./common/app-error"
import { AppExceptionFilter } from "./common/http-exception.filter"
import { LoggingInterceptor } from "./common/logging.interceptor"
import { readEnv } from "./config/env"

export function configureApp(app: INestApplication) {
  const env = readEnv()
  app.use(helmet())
  app.use(json({ limit: "32kb" }))
  app.use(cookieParser())
  app.setGlobalPrefix("api")
  app.useGlobalFilters(new AppExceptionFilter())
  app.useGlobalInterceptors(new LoggingInterceptor())
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      exceptionFactory: () => new AppError("invalid", 400),
    }),
  )
  if (env.trustProxy) {
    app.getHttpAdapter().getInstance().set("trust proxy", "loopback")
  }
}
