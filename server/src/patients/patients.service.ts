import { Injectable } from "@nestjs/common"
import { AppError } from "../common/app-error"
import { PrismaService } from "../prisma/prisma.service"
import { assertBirthDate, assertPhone, toAccount } from "../auth/account"
import type { ProfileDto } from "./profile.dto"

@Injectable()
export class PatientsService {
  constructor(private readonly prisma: PrismaService) {}

  async update(patientId: string, patch: ProfileDto) {
    if (patch.firstName !== undefined && patch.firstName.length < 2) {
      throw new AppError("invalid", 400)
    }
    if (patch.lastName !== undefined && patch.lastName.length < 2) {
      throw new AppError("invalid", 400)
    }
    if (patch.phone !== undefined && !assertPhone(patch.phone)) {
      throw new AppError("invalid", 400)
    }
    if (patch.birthDate !== undefined && !assertBirthDate(patch.birthDate)) {
      throw new AppError("invalid", 400)
    }
    const patient = await this.prisma.patient.update({
      where: { id: patientId },
      data: {
        firstName: patch.firstName,
        lastName: patch.lastName,
        phone: patch.phone,
        birthDate: patch.birthDate ? new Date(`${patch.birthDate}T00:00:00.000Z`) : undefined,
        language: patch.language,
        profile: {
          upsert: {
            create: profileData(patch),
            update: profileData(patch),
          },
        },
      },
      include: { profile: true },
    })
    return toAccount(patient)
  }

  async remove(patientId: string) {
    await this.prisma.patient.delete({ where: { id: patientId } })
  }
}

function profileData(patch: ProfileDto) {
  return {
    city: patch.city,
    bloodGroup: patch.bloodGroup,
    allergies: patch.allergies,
    conditions: patch.conditions,
    medicationsNote: patch.medicationsNote,
    emergencyName: patch.emergencyName,
    emergencyPhone: patch.emergencyPhone,
    onboarded: patch.onboarded,
    notifyInApp: patch.notifyInApp,
    shareWithCare: patch.shareWithCare,
  }
}
