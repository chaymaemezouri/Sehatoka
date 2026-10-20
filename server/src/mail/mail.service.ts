import { Injectable, Logger } from "@nestjs/common"
import nodemailer from "nodemailer"
import { readEnv } from "../config/env"

export interface ResetDelivery {
  to: string
  token: string
}

@Injectable()
export class MailService {
  private readonly logger = new Logger("mail")
  readonly outbox: ResetDelivery[] = []

  mode(): "off" | "memory" | "smtp" {
    if (!readEnv().passwordResetEnabled) {
      return "off"
    }
    if (readEnv().nodeEnv === "test" && process.env.SMTP_HOST === "memory") {
      return "memory"
    }
    if (this.smtpReady()) {
      return "smtp"
    }
    return "off"
  }

  async sendReset(to: string, token: string) {
    const mode = this.mode()
    if (mode === "memory") {
      this.outbox.push({ to, token })
      return
    }
    if (mode !== "smtp") {
      return
    }
    const port = Number(process.env.SMTP_PORT)
    const transport = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: port === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    })
    await transport.sendMail({
      from: process.env.SMTP_FROM,
      to,
      subject: "Sehatoka — mot de passe",
      text: [
        "Un code permet de choisir un nouveau mot de passe Sehatoka.",
        "Il expire dans 30 minutes et ne peut servir qu'une fois.",
        "",
        token,
      ].join("\n"),
    })
    this.logger.log("password reset message handed to the mail transport")
  }

  private smtpReady() {
    return Boolean(
      process.env.SMTP_HOST?.trim() &&
        process.env.SMTP_PORT?.trim() &&
        process.env.SMTP_FROM?.trim() &&
        process.env.SMTP_USER?.trim() &&
        process.env.SMTP_PASS?.trim(),
    )
  }
}
