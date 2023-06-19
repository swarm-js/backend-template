import { AuthPlugin } from '@swarmjs/auth'
import { Swarm } from '@swarmjs/core'
import { MonitorPlugin } from '@swarmjs/monitoring'
import { SwaggerPlugin } from '@swarmjs/swagger'
import mongoose, { ConnectOptions } from 'mongoose'
import Users from './controllers/Users'
import config from './config/authConfig'
import User from './models/User'

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
  ],
  languages: ['fr', 'en']
})

app.fastify.register(require('@fastify/cors'), {
  origin: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
})

app.use(MonitorPlugin)
app.use(SwaggerPlugin)
app.use(AuthPlugin, { ...config, model: User })

app.controllers.add(Users)

async function main () {
  mongoose.connect(process.env.MONGO_DSN ?? 'mongodb://localhost:27017/test', {
    useNewUrlParser: true
  } as ConnectOptions)
  await app.listen(+(process.env.PORT ?? 8080), process.env.HOST ?? '0.0.0.0')
}
main()
