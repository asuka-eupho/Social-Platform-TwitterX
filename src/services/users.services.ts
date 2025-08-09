import User from "~/models/schemas/User.schema"
import databaseService from "./database.services"

class UserService {
  async register(payload: { email: string, password: string }) {
    const { email, password } = payload
    const res = await databaseService.users.insertOne(
      new User({
        email,
        password
      })
    )
    return res
  }
}
const userService = new UserService()
export default userService