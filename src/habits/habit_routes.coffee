HabitHandler = require('./habit_handler').HabitHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/habits/all/',
    handler: (request, reply) ->
      HabitHandler.getAll(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().optional()
        }
      },
      tags: ['api'],
      description: 'Get all habits for user'
    }
  },
  {
    method: 'GET',
    path: '/habits/{habitId}/',
    handler: (request, reply) ->
      HabitHandler.get(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          habitId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get a specific user\'s habit by its habitId'
    }
  },
  {
    method: 'POST',
    path: '/habits/',
    handler: (request, reply) ->
      HabitHandler.create(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        payload: {
          text: Joi.string().required()
          state: Joi.number().optional()
        }
      },
      tags: ['api'],
      description: 'Creating a new habit for a user'
    }
  },
  {
    method: 'POST',
    path: '/habits/increment/{habitId}/',
    handler: (request, reply) ->
      HabitHandler.increment(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          habitId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Incrementing a user\'s habit'
    }
  },
  {
    method: 'PUT',
    path: '/habits/{habitId}/',
    handler: (request, reply) ->
      HabitHandler.update(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          habitId: Joi.string().required()
        },
        payload: {
          text: Joi.string().optional()
          state: Joi.number().optional()
        }
      },
      tags: ['api'],
      description: 'Update a specific user\'s habit'
    }
  },
  {
    method: 'DELETE',
    path: '/habits/{habitId}/',
    handler: (request, reply) ->
      HabitHandler.delete(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          habitId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Delete a specific user\'s habit.'
    }
  }
]

module.exports.routes = routes
