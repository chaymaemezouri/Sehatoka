import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common"
import { timingSafeEqual } from "node:crypto"
import type { Request, Response } from "express"
import { readEnv } from "../config/env"
import { AppError } from "./app-error"
import { csrfCookie, newToken } from "./cookies"

@Injectable()
export class OriginCsrfGuard implements CanActivate {
  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest<Request>()
    const response = context.switchToHttp().getResponse<Response>()
    ensureCsrfCookie(request, response)
    if (request.method === "GET" || request.method === "HEAD" || request.method === "OPTIONS") {
      return true
    }
    assertOrigin(request)
    assertCsrf(request)
    return true
  }
}

export function ensureCsrfCookie(request: Request, response: Response) {
  const current = readCookie(request, csrfCookie)
  if (current && current.length >= 32) {
    return current
  }
  const token = newToken()
  const env = readEnv()
  response.cookie(csrfCookie, token, {
    httpOnly: false,
    secure: env.cookieSecure,
    sameSite: "lax",
    path: "/",
    maxAge: env.sessionTtlMs,
  })
  return token
}

function assertOrigin(request: Request) {
  const origin = request.header("origin")
  const allowed = readEnv().origins
  if (!origin || !allowed.includes(origin)) {
    throw new AppError("rejected", 403)
  }
}

function assertCsrf(request: Request) {
  const header = request.header("x-csrf-token") ?? ""
  const cookie = readCookie(request, csrfCookie) ?? ""
  const headerBuffer = Buffer.from(header)
  const cookieBuffer = Buffer.from(cookie)
  if (headerBuffer.length < 32 || headerBuffer.length !== cookieBuffer.length || !timingSafeEqual(headerBuffer, cookieBuffer)) {
    throw new AppError("rejected", 403)
  }
}

function readCookie(request: Request, name: string) {
  const value = request.cookies?.[name]
  return typeof value === "string" ? value : undefined
}
