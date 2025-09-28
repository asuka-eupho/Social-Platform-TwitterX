import { createHash } from "crypto";
import { config } from "dotenv";

config()
export function sha256(content: string) {
  return createHash("SHA256").update(content).digest("hex")
}
export function hashPassword(content: string) {
  return sha256(content)
}