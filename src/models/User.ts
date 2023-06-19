import { MongooseAuthPlugin, InvitationMethods } from '@swarmjs/auth'
import { MailjetPlugin } from '@swarmjs/mailjet'
import mongoose from 'mongoose'
import config from '../config/authConfig'
require('dotenv').config()

interface IUser {
  firstname?: string
  lastname?: string
  email?: string
  avatar?: string
}

interface UserModel extends mongoose.Model<IUser, {}, {}>, InvitationMethods {}

// 2. Create a Schema corresponding to the document interface.
const userSchema = new mongoose.Schema<IUser, UserModel, {}>({
  firstname: String,
  lastname: String,
  email: String,
  avatar: String
})

userSchema.plugin(MongooseAuthPlugin, { ...config })

userSchema.plugin(MailjetPlugin, {
  apiKey: process.env.MJ_API_KEY,
  apiSecret: process.env.MJ_API_SECRET,
  fromEmail: process.env.FROM_EMAIL,
  fromName: process.env.FROM_NAME
})

// 3. Create a Model.
export default mongoose.model<IUser, UserModel>('User', userSchema)
