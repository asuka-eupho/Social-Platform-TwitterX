import { createHash } from "crypto";

export function sha256(content: string){
    return createHash('sha26').update(content).digest('hex')
}
export function hashPassword(content: string){
    return sha256(content)
}