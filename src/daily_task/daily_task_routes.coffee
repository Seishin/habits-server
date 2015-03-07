DailyTaskHandler = require('./daily_task_handler').DailyTaskHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/daily-task/{taskId}/',
    handler: (request, reply) ->
      DailyTaskHandler.getTask(request, reply)
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
      DailyTaskHandler.getAllTasks(request, reply)
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
      DailyTaskHandler.createTask(request, reply)
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
  },
  {
    method: 'POST',
    path: '/daily-task/{taskId}/check/',
    handler: (request, reply) ->
      DailyTaskHandler.checkTask(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          taskId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Set a specific task checked.'
    }
  },
  {
    method: 'POST',
    path: '/daily-task/{taskId}/uncheck/',
    handler: (request, reply) ->
      DailyTaskHandler.uncheckTask(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          taskId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Set a specific task unchecked.'
    }
  },
  {
    method: 'PUT',
    path: '/daily-task/{taskId}/',
    handler: (request, reply) ->
      DailyTaskHandler.updateTask(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          taskId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Update a specific task.'
    }
  },
  {
    method: 'DELETE',
    path: '/daily-task/{taskId}/',
    handler: (request, reply) ->
      DailyTaskHandler.deleteTask(request, reply)
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
      description: 'Delete a specific task.'
    }
  }
]

module.exports.routes = routes

