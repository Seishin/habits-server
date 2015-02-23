UserHandler = require('../handlers/user_handler').UserHandler
Joi = require 'joi'

routes = [
  {
    method: 'POST',
    path: '/users/create',
    handler: (request, reply) ->
      UserHandler.create(reply, request.payload)
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
      UserHandler.login(reply, request.payload)
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
