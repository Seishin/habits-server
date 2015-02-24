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
    path: '/habits/create',
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
    method: 'PUT',
    path: '/habits/update/{habitId}',
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
          counter: Joi.number().optional()
        }
      }
    }
  },
  {
    method: 'DELETE',
    path: '/habits/delete/{habitId}',
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
