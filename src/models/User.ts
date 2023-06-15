import { MongooseAuthPlugin } from '@swarmjs/auth'
import { MailjetPlugin } from '@swarmjs/mailjet'
import mongoose from 'mongoose'
require('dotenv').config()

interface IUser {
  firstname?: string
  lastname?: string
  email?: string
  avatar?: string
}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser>({
  firstname: String,
  lastname: String,
  email: String,
  avatar: String
})

userSchema.plugin(MongooseAuthPlugin, {
  password: process.env.AUTH_PASSWORD === 'true',
  fido2: process.env.AUTH_FIDO2 === 'true',
  facebook: process.env.AUTH_FACEBOOK === 'true',
  google: process.env.AUTH_GOOGLE === 'true',
  googleAuthenticator: process.env.AUTH_GOOGLE_AUTHENTICATOR === 'true',
  ethereum: process.env.AUTH_ETHEREUM === 'true'
})

userSchema.plugin(MailjetPlugin, {
  apiKey: process.env.MJ_API_KEY,
  apiSecret: process.env.MJ_API_SECRET,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME
})

// 3. Create a Model.
export default mongoose.model<IUser>('User', userSchema)
