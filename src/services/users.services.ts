import User from "~/models/schemas/User.schema"
import databaseService from "./database.services"
import { RegisterReqBody } from "~/models/requests/user.requests"
import { hashPassword } from "~/utils/crypto"
import { signToken } from "~/utils/jwt"
import { TokenType } from "~/constants/enums"

class UserService {
  private signAccessToken(user_id: string){
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.AccesToken
      },
      options: {
        expiresIn: '15m'
      }
    })
  }
  private signRefreshToken(user_id: string){
    return signToken({
      payload: {
        user_id,
        token_type: TokenType.RefreshToken
      },
      options: {
        expiresIn: '50d'
      }
    })
  }

  async register(payload: RegisterReqBody) {
    const res = await databaseService.users.insertOne(
      new User({
       ...payload,
       date_of_birth: new Date(payload.date_of_birth),
       password : hashPassword(payload.password)
      })
    )
    const user_id = res.insertedId.toString()
    const [access_token, refresh_token] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return {
      access_token, refresh_token
    }
  }
}
const userService = new UserService()
export default userService