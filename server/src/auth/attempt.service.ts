import { createHash } from "node:crypto"
import { Injectable } from "@nestjs/common"
import { readEnv } from "../config/env"
import { AppError } from "../common/app-error"
import { PrismaService } from "../prisma/prisma.service"

@Injectable()
export class AttemptService {
  constructor(private readonly prisma: PrismaService) {}

  async assert(scope: string, ip: string, email: string, limit: number, windowMs: number) {
    const since = new Date(Date.now() - windowMs)
    const count = await this.prisma.authAttempt.count({
      where: { subject: this.subject(scope, ip, email), createdAt: { gte: since } },
    })
    if (count >= limit) {
      throw new AppError("rate", 429)
    }
  }

  async record(scope: string, ip: string, email: string) {
    await this.prisma.authAttempt.create({ data: { subject: this.subject(scope, ip, email) } })
  }

  private subject(scope: string, ip: string, email: string) {
    return createHash("sha256")
      .update(`${readEnv().attemptPepper}\0${scope}\0${ip}\0${email.trim().toLowerCase()}`)
      .digest("hex")
  }
}
