UserHandler = require('./user_handler').UserHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/users/{userId}',
    handler: (request, reply) ->
      UserHandler.get(request, reply)
    ,
    config: {
      validate: {
        params: {
          userId: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/users/create',
    handler: (request, reply) ->
      UserHandler.create(request, reply)
    ,
    config: {
      validate: {
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required(),
          profileAvatar: Joi.string().optional(),
          name: Joi.string().optional()
        }
      }
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
        payload: {
          email: Joi.string().required(),
          password: Joi.string().required()
        }
      }
    }
  }
]

module.exports.routes = routes