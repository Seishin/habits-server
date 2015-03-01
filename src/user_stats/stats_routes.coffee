UserStatsHandler = require('./stats_handler').UserStatsHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/stats/{userId}',
    handler: (request, reply) ->
      UserStatsHandler.get(request, reply)
    ,
    config: {
      validate: {
        params: {
          userId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get user\'s stats'
    }
  }
]

module.exports.routes = routes
