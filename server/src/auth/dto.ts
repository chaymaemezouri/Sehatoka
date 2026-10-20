import { Transform } from "class-transformer"
import { IsEmail, IsIn, IsString, MaxLength } from "class-validator"

function trim(value: unknown) {
  return typeof value === "string" ? value.trim() : value
}

export class RegisterDto {
  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  firstName!: string

  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(80)
  lastName!: string

  @Transform(({ value }) => trim(value))
  @IsEmail()
  @MaxLength(254)
  email!: string

  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(40)
  phone!: string

  @Transform(({ value }) => trim(value))
  @IsString()
  @MaxLength(10)
  birthDate!: string

  @IsString()
  @MaxLength(200)
  password!: string

  @IsIn(["fr", "en"])
  language!: "fr" | "en"
}

export class LoginDto {
  @Transform(({ value }) => trim(value))
  @IsEmail()
  @MaxLength(254)
  email!: string

  @IsString()
  @MaxLength(200)
  password!: string
}

export class PasswordDto {
  @IsString()
  @MaxLength(200)
  currentPassword!: string

  @IsString()
  @MaxLength(200)
  nextPassword!: string
}

export class ResetRequestDto {
  @Transform(({ value }) => trim(value))
  @IsEmail()
  @MaxLength(254)
  email!: string
}

export class ResetConfirmDto {
  @IsString()
  @MaxLength(200)
  token!: string

  @IsString()
  @MaxLength(200)
  password!: string
}
