import { Injectable, Logger } from "@nestjs/common"
import { Prisma } from "@prisma/client"
import { AppError } from "../common/app-error"
import { hashToken, newToken } from "../common/cookies"
import { MailService } from "../mail/mail.service"
import { PrismaService } from "../prisma/prisma.service"
import { assertBirthDate, assertPhone, toAccount, type PatientAccount } from "./account"
import { AttemptService } from "./attempt.service"
import type { LoginDto, RegisterDto, ResetConfirmDto } from "./dto"
import { PasswordService } from "./password.service"
import { SessionService } from "./session.service"

const resetTtlMs = 30 * 60 * 1000

@Injectable()
export class AuthService {
  private readonly logger = new Logger("auth")

  constructor(
    private readonly prisma: PrismaService,
    private readonly passwords: PasswordService,
    private readonly attempts: AttemptService,
    private readonly sessions: SessionService,
    private readonly mail: MailService,
  ) {}

  async register(input: RegisterDto, ip: string): Promise<PatientAccount> {
    this.passwords.assertStrong(input.password)
    if (input.firstName.trim().length < 2 || input.lastName.trim().length < 2) {
      throw new AppError("invalid", 400)
    }
    if (!assertPhone(input.phone) || !assertBirthDate(input.birthDate)) {
      throw new AppError("invalid", 400)
    }
    const email = input.email.trim().toLowerCase()
    await this.attempts.assert("register-ip", ip, "", 10, 60 * 60 * 1000)
    await this.attempts.assert("register", ip, email, 5, 60 * 60 * 1000)
    await this.attempts.record("register-ip", ip, "")
    await this.attempts.record("register", ip, email)
    try {
      const patient = await this.prisma.patient.create({
        data: {
          email,
          passwordHash: await this.passwords.hash(input.password),
          firstName: input.firstName.trim(),
          lastName: input.lastName.trim(),
          phone: input.phone.trim(),
          birthDate: new Date(`${input.birthDate}T00:00:00.000Z`),
          language: input.language,
          profile: { create: {} },
        },
        include: { profile: true },
      })
      return toAccount(patient)
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
        throw new AppError("exists", 409)
      }
      throw error
    }
  }

  async login(input: LoginDto, ip: string): Promise<PatientAccount> {
    const email = input.email.trim().toLowerCase()
    await this.attempts.assert("login", ip, email, 5, 15 * 60 * 1000)
    const patient = await this.prisma.patient.findUnique({ where: { email }, include: { profile: true } })
    const passwordOk = await this.passwords.verify(patient?.passwordHash ?? (await this.passwords.dummy()), input.password)
    if (!patient || !passwordOk) {
      await this.attempts.record("login", ip, email)
      throw new AppError("invalid", 401)
    }
    return toAccount(patient)
  }

  async changePassword(patientId: string, currentPassword: string, nextPassword: string) {
    this.passwords.assertStrong(nextPassword)
    const patient = await this.prisma.patient.findUnique({ where: { id: patientId } })
    if (!patient) {
      throw new AppError("missing", 401)
    }
    const matches = await this.passwords.verify(patient.passwordHash, currentPassword)
    if (!matches) {
      throw new AppError("invalid", 401)
    }
    await this.prisma.patient.update({
      where: { id: patientId },
      data: { passwordHash: await this.passwords.hash(nextPassword) },
    })
    await this.sessions.revokeAll(patientId)
  }

  async requestReset(email: string, ip: string) {
    if (this.mail.mode() === "off") {
      return
    }
    const normalized = email.trim().toLowerCase()
    await this.attempts.assert("reset-ip", ip, "", 10, 60 * 60 * 1000)
    await this.attempts.assert("reset", ip, normalized, 3, 60 * 60 * 1000)
    await this.attempts.record("reset-ip", ip, "")
    await this.attempts.record("reset", ip, normalized)
    const patient = await this.prisma.patient.findUnique({ where: { email: normalized } })
    if (!patient) {
      return
    }
    const token = newToken()
    const created = await this.prisma.passwordReset.create({
      data: {
        patientId: patient.id,
        tokenHash: hashToken(token),
        expiresAt: new Date(Date.now() + resetTtlMs),
      },
    })
    try {
      await this.mail.sendReset(patient.email, token)
    } catch {
      await this.prisma.passwordReset.delete({ where: { id: created.id } })
      this.logger.error("password reset delivery failed")
    }
  }

  async confirmReset(input: ResetConfirmDto) {
    this.passwords.assertStrong(input.password)
    const passwordHash = await this.passwords.hash(input.password)
    const tokenHash = hashToken(input.token)
    await this.prisma.$transaction(async (tx) => {
      const reset = await tx.passwordReset.findUnique({ where: { tokenHash } })
      if (!reset || reset.usedAt || reset.expiresAt.getTime() <= Date.now()) {
        throw new AppError("invalid", 400)
      }
      await tx.patient.update({ where: { id: reset.patientId }, data: { passwordHash } })
      await tx.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } })
      await tx.session.updateMany({
        where: { patientId: reset.patientId, revokedAt: null },
        data: { revokedAt: new Date() },
      })
    })
  }
}
