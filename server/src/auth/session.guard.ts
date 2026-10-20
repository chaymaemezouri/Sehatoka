import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import type { Request } from "express"
import { AppError } from "../common/app-error"
import { sessionCookie } from "../common/cookies"
import type { PatientAccount } from "./account"
import { SessionService } from "./session.service"

@Injectable()
export class SessionGuard implements CanActivate {
  constructor(private readonly sessions: SessionService) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request & { patient?: PatientAccount }>()
    const token = request.cookies?.[sessionCookie]
    const account = await this.sessions.accountForToken(typeof token === "string" ? token : undefined)
    if (!account) {
      throw new AppError("invalid", 401)
    }
    request.patient = account
    return true
  }
}
