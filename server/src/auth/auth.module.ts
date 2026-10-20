import { Module } from "@nestjs/common"
import { MailModule } from "../mail/mail.module"
import { AttemptService } from "./attempt.service"
import { AuthController } from "./auth.controller"
import { AuthService } from "./auth.service"
import { PasswordService } from "./password.service"
import { SessionGuard } from "./session.guard"
import { SessionService } from "./session.service"

@Module({
  imports: [MailModule],
  controllers: [AuthController],
  providers: [AuthService, PasswordService, AttemptService, SessionService, SessionGuard],
  exports: [SessionService, SessionGuard],
})
export class AuthModule {}
