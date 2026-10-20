import { Body, Controller, Delete, Patch, Res, UseGuards } from "@nestjs/common"
import type { Response } from "express"
import { CurrentPatient } from "../auth/current-patient.decorator"
import type { PatientAccount } from "../auth/account"
import { SessionGuard } from "../auth/session.guard"
import { SessionService } from "../auth/session.service"
import { ProfileDto } from "./profile.dto"
import { PatientsService } from "./patients.service"

@Controller("patients")
@UseGuards(SessionGuard)
export class PatientsController {
  constructor(
    private readonly patients: PatientsService,
    private readonly sessions: SessionService,
  ) {}

  @Patch("me")
  update(@CurrentPatient() patient: PatientAccount, @Body() body: ProfileDto) {
    return this.patients.update(patient.id, body)
  }

  @Delete("me")
  async remove(@CurrentPatient() patient: PatientAccount, @Res({ passthrough: true }) response: Response) {
    await this.patients.remove(patient.id)
    this.sessions.clear(response)
    return { ok: true }
  }
}
