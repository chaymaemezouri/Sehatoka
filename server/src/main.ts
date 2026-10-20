import "reflect-metadata"
import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { configureApp } from "./configure-app"
import { readEnv } from "./config/env"

async function bootstrap() {
  const env = readEnv()
  const app = await NestFactory.create(AppModule, { bodyParser: false, logger: ["error", "warn", "log"] })
  configureApp(app)
  await app.listen(env.port, env.host)
}

void bootstrap()
