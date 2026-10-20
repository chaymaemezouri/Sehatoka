import { Body, Controller, Get, HttpCode, HttpStatus, Post, Req, Res, UseGuards } from "@nestjs/common"
import type { Request, Response } from "express"
import { sessionCookie } from "../common/cookies"
import { CurrentPatient } from "./current-patient.decorator"
import { LoginDto, PasswordDto, RegisterDto, ResetConfirmDto, ResetRequestDto } from "./dto"
import { AuthService } from "./auth.service"
import type { PatientAccount } from "./account"
import { SessionGuard } from "./session.guard"
import { SessionService } from "./session.service"

@Controller("auth")
export class AuthController {
  constructor(
    private readonly auth: AuthService,
    private readonly sessions: SessionService,
  ) {}

  @Get("csrf")
  csrf() {
    return { ok: true }
  }

  @Post("register")
  async register(@Body() body: RegisterDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const account = await this.auth.register(body, request.ip ?? "")
    await this.sessions.open(response, account.id)
    return account
  }

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto, @Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const account = await this.auth.login(body, request.ip ?? "")
    await this.sessions.open(response, account.id)
    return account
  }

  @Post("logout")
  @HttpCode(HttpStatus.OK)
  async logout(@Req() request: Request, @Res({ passthrough: true }) response: Response) {
    const token = request.cookies?.[sessionCookie]
    await this.sessions.revoke(typeof token === "string" ? token : undefined)
    this.sessions.clear(response)
    return { ok: true }
  }

  @Get("me")
  @UseGuards(SessionGuard)
  me(@CurrentPatient() patient: PatientAccount) {
    return patient
  }

  @Post("password")
  @HttpCode(HttpStatus.OK)
  @UseGuards(SessionGuard)
  async password(
    @CurrentPatient() patient: PatientAccount,
    @Body() body: PasswordDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.auth.changePassword(patient.id, body.currentPassword, body.nextPassword)
    await this.sessions.open(response, patient.id)
    return { ok: true }
  }

  @Post("password-reset/request")
  @HttpCode(HttpStatus.OK)
  async requestReset(@Body() body: ResetRequestDto, @Req() request: Request) {
    await this.auth.requestReset(body.email, request.ip ?? "")
    return { ok: true }
  }

  @Post("password-reset/confirm")
  @HttpCode(HttpStatus.OK)
  async confirmReset(@Body() body: ResetConfirmDto) {
    await this.auth.confirmReset(body)
    return { ok: true }
  }
}
