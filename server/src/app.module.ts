import { Module } from "@nestjs/common"
import { APP_GUARD } from "@nestjs/core"
import { AuthModule } from "./auth/auth.module"
import { OriginCsrfGuard } from "./common/origin-csrf.guard"
import { HealthController } from "./health/health.controller"
import { PatientsModule } from "./patients/patients.module"
import { PrismaModule } from "./prisma/prisma.module"

@Module({
  imports: [PrismaModule, AuthModule, PatientsModule],
  controllers: [HealthController],
  providers: [{ provide: APP_GUARD, useClass: OriginCsrfGuard }],
})
export class AppModule {}
