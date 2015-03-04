DailyTaskHandler = require('./daily_task_handler').DailyTaskHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/daily-task/{taskId}/',
    handler: (request, reply) ->
      DailyTaskHandler.getOne(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          taskId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get a single specific daily task.'
    }
  },
  {
    method: 'GET',
    path: '/daily-task/all/',
    handler: (request, reply) ->
      DailyTaskHandler.getAll(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get all daily tasks.'
    }
  },
  {
    method: 'POST',
    path: '/daily-task/',
    handler: (request, reply) ->
      DailyTaskHandler.createOne(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        payload: {
          text: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Creating a new daily task.'
    }
  }
]

module.exports.routes = routes

