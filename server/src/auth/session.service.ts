import { Injectable } from "@nestjs/common"
import type { Response } from "express"
import { readEnv } from "../config/env"
import { hashToken, newToken, sessionCookie } from "../common/cookies"
import { PrismaService } from "../prisma/prisma.service"
import { toAccount, type PatientAccount } from "./account"

@Injectable()
export class SessionService {
  constructor(private readonly prisma: PrismaService) {}

  async open(response: Response, patientId: string) {
    const token = newToken()
    const env = readEnv()
    await this.prisma.session.create({
      data: {
        patientId,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + env.sessionTtlMs),
      },
    })
    response.cookie(sessionCookie, token, {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: "lax",
      path: "/api",
      maxAge: env.sessionTtlMs,
    })
  }

  clear(response: Response) {
    const env = readEnv()
    response.clearCookie(sessionCookie, {
      httpOnly: true,
      secure: env.cookieSecure,
      sameSite: "lax",
      path: "/api",
    })
  }

  async revoke(token: string | undefined) {
    if (!token) {
      return
    }
    await this.prisma.session.updateMany({
      where: { tokenHash: hashToken(token), revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async revokeAll(patientId: string) {
    await this.prisma.session.updateMany({
      where: { patientId, revokedAt: null },
      data: { revokedAt: new Date() },
    })
  }

  async accountForToken(token: string | undefined): Promise<PatientAccount | null> {
    if (!token) {
      return null
    }
    const row = await this.prisma.session.findUnique({
      where: { tokenHash: hashToken(token) },
      include: { patient: { include: { profile: true } } },
    })
    if (!row || row.revokedAt || row.expiresAt.getTime() <= Date.now()) {
      return null
    }
    return toAccount(row.patient)
  }
}
