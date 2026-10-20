import { createParamDecorator, ExecutionContext } from "@nestjs/common"
import type { Request } from "express"
import type { PatientAccount } from "./account"

export const CurrentPatient = createParamDecorator((_: unknown, context: ExecutionContext) => {
  const request = context.switchToHttp().getRequest<Request & { patient?: PatientAccount }>()
  return request.patient
})
