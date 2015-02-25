HabitHandler = require('./habit_handler').HabitHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/habits/all',
    handler: (request, reply) ->
      HabitHandler.getAll(request, reply)
  },
  {
    method: 'GET',
    path: '/habits/{habitId}',
    handler: (request, reply) ->
      HabitHandler.get(request, reply)
    ,
    config: {
      validate: {
        params: {
          habitId: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/habits',
    handler: (request, reply) ->
      HabitHandler.create(request, reply)
    ,
    config: {
      validate: {
        payload: {
          text: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'POST',
    path: '/habits/increment/{habitId}',
    handler: (request, reply) ->
      HabitHandler.increment(request, reply)
    ,
    config: {
      validate: {
        params: {
          habitId: Joi.string().required()
        }
      }
    }
  },
  {
    method: 'PUT',
    path: '/habits/{habitId}',
    handler: (request, reply) ->
      HabitHandler.update(request, reply)
    ,
    config: {
      validate: {
        params: {
          habitId: Joi.string().required()
        },
        payload: {
          text: Joi.string().optional()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/habits/{habitId}',
    handler: (request, reply) ->
      HabitHandler.delete(request, reply)
    ,
    config: {
      validate: {
        params: {
          habitId: Joi.string().required()
        }
      }
    }
  }
]

module.exports.routes = routes
