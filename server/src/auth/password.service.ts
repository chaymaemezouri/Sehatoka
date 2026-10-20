import { Injectable } from "@nestjs/common"
import { Algorithm, hash, verify } from "@node-rs/argon2"
import { AppError } from "../common/app-error"

const options = {
  algorithm: Algorithm.Argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
}

@Injectable()
export class PasswordService {
  private dummyHash: string | null = null

  assertStrong(password: string) {
    if (password.length < 8 || password.length > 200 || !/[A-Za-z]/.test(password) || !/\d/.test(password)) {
      throw new AppError("weak", 400)
    }
  }

  async hash(password: string) {
    return hash(password, options)
  }

  async verify(passwordHash: string, password: string) {
    try {
      return await verify(passwordHash, password, options)
    } catch {
      return false
    }
  }

  async dummy() {
    this.dummyHash ??= await this.hash("sehatoka-dummy-secret")
    return this.dummyHash
  }
}
