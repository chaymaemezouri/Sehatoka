import { Transform } from "class-transformer"
import { IsBoolean, IsIn, IsOptional, IsString, MaxLength } from "class-validator"

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : value
}

export class ProfileDto {
  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  firstName?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  lastName?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(40)
  phone?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(10)
  birthDate?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  city?: string

  @IsOptional()
  @IsIn(["fr", "en"])
  language?: "fr" | "en"

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(16)
  bloodGroup?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  allergies?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  conditions?: string

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  medicationsNote?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  emergencyName?: string

  @IsOptional()
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(40)
  emergencyPhone?: string

  @IsOptional()
  @IsBoolean()
  onboarded?: boolean

  @IsOptional()
  @IsBoolean()
  notifyInApp?: boolean

  @IsOptional()
  @IsBoolean()
  shareWithCare?: boolean
}
