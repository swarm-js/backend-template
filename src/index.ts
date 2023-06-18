import { AuthPlugin } from '@swarmjs/auth'
import { Swarm } from '@swarmjs/core'
import { MonitorPlugin } from '@swarmjs/monitoring'
import { SwaggerPlugin } from '@swarmjs/swagger'
import mongoose, { ConnectOptions } from 'mongoose'
import User from './models/User'
import Users from './controllers/Users'

require('dotenv').config()

const app = new Swarm({
  logLevel: process.env.LOG_LEVEL ?? 'info',
  title: process.env.APP_TITLE,
  description: process.env.APP_DESCRIPTION,
  baseUrl: process.env.BASE_URL ?? '',
  servers: [
    {
      url: process.env.BASE_URL ?? '',
      description: process.env.APP_TITLE ?? ''
    }
  ]
})

app.fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.use(MonitorPlugin)
app.use(SwaggerPlugin)
app.use(AuthPlugin, {
  jwtKey: process.env.AUTH_JWT_KEY,
  logo: (process.env.LOGO ?? '').length ? process.env.LOGO : null,
  themeColor: process.env.COLOR ?? '#2196F3',
  model: User,
  validationRequired: process.env.AUTH_VALIDATION_REQUIRED === 'true',
  googleClientId: process.env.AUTH_GOOGLE_CLIENT_ID ?? '',
  googleClientSecret: process.env.AUTH_GOOGLE_CLIENT_SECRET ?? '',
  facebookClientId: process.env.AUTH_FACEBOOK_CLIENT_ID ?? '',
  facebookClientSecret: process.env.AUTH_FACEBOOK_CLIENT_SECRET ?? '',
  allowedDomains: (process.env.AUTH_DOMAINS ?? '')
    .split(',')
    .filter(a => a.length)
})

app.controllers.add(Users)

async function main () {
  mongoose.connect(process.env.MONGO_DSN ?? 'mongodb://localhost:27017/test', {
    useNewUrlParser: true
  } as ConnectOptions)
  await app.listen(+(process.env.PORT ?? 8080), process.env.HOST ?? '0.0.0.0')
}
main()
