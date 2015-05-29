UserHandler = require('./user_handler').UserHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: (request, reply) ->
      UserHandler.getUserProfileById(request, reply)
    ,
    config: {
      validate: {
        params: {
          userId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get a specific user by his userId'
    },
  },
  {
    method: 'GET',
    path: '/users',
    handler: (request, reply) ->
      UserHandler.getUserProfileByToken(request, reply)
    ,
    config: {
      tags: ['api'],
      description: 'Get a specific user by his token'
    },
  },
  {
    method: 'POST',
    path: '/users',
    handler: (request, reply) ->
      UserHandler.create(request, reply)
    ,
    config: {
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required(),
          profileAvatar: Joi.string().empty(null).optional(),
          name: Joi.string().optional()
        }).unknown()
      },
      tags: ['api'],
      description: 'Create a new user'
    }
  },
  {
    method: 'POST',
    path: '/users/login',
    handler: (request, reply) ->
      UserHandler.login(request, reply)
    ,
    config: {
      validate: {
        payload: Joi.object({
          email: Joi.string().required(),
          password: Joi.string().required()
        }).unknown()
      },
      tags: ['api'],
      description: 'Login user'
    }
  }
]

module.exports.routes = routes
