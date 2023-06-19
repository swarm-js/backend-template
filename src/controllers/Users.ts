import {
  Accepts,
  Access,
  Delete,
  Description,
  FastifyReply,
  Get,
  Parameter,
  Patch,
  Post,
  Prefix,
  Put,
  Returns,
  Title
} from '@swarmjs/core'
import User from '../models/User'
import { Crud } from '@swarmjs/crud'

const crud = new Crud(User)

@Title('Users')
@Description('Manages users')
@Prefix('/users')
export default class Users {
  @Get('/')
  @Access('admin')
  static async list (request: any, reply: FastifyReply) {
    return crud.list(request, reply)
  }

  @Get('/first')
  @Access('admin')
  static async first (request: any, reply: FastifyReply) {
    return crud.first(request, reply)
  }

  @Get('/last')
  @Access('admin')
  static async last (request: any, reply: FastifyReply) {
    return crud.last(request, reply)
  }

  @Get('/count')
  @Access('admin')
  static async count (request: any, reply: FastifyReply) {
    return crud.count(request, reply)
  }

  @Post('/')
  @Access('admin')
  @Accepts('SendInvitation')
  @Returns(200, 'BooleanStatus', 'The invitation has been sent')
  @Returns(409, 'Error', 'A user already exists with this email address')
  static async create (request: any) {
    const status = await User.invite(
      request,
      request.body.email,
      request.body.redirect,
      {
        firstname: request.body.firstname,
        lastname: request.body.lastname
      }
    )
    return { status }
  }

  @Get('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  static async get (request: any, reply: FastifyReply) {
    if (request.params.id === 'me') request.params.id = request.user.id
    return crud.get(request, reply)
  }

  @Put('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  static async replace (request: any, reply: FastifyReply) {
    if (request.params.id === 'me') request.params.id = request.user.id
    return crud.replace(request, reply)
  }

  @Patch('/:id')
  @Access(['admin', 'user:{id}'])
  @Parameter('id', { type: 'string' }, 'User ID')
  static async update (request: any, reply: FastifyReply) {
    if (request.params.id === 'me') request.params.id = request.user.id
    return crud.update(request, reply)
  }

  @Delete('/:id')
  @Access('admin')
  @Parameter('id', { type: 'string' }, 'User ID')
  static async delete (request: any, reply: FastifyReply) {
    return crud.delete(request, reply)
  }
}
