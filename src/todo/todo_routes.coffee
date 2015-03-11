ToDoHandler = require('./todo_handler').ToDoHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/todos/{todoId}/',
    handler: (request, reply) ->
      ToDoHandler.getToDo(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
        },
        params: {
          todoId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get a to do task'
    }
  },
  {
    method: 'GET',
    path: '/todos/all/',
    handler: (request, reply) ->
      ToDoHandler.getAllToDos(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get all to do tasks'
    }
  },
  {
    method: 'POST',
    path: '/todos/',
    handler: (request, reply) ->
      ToDoHandler.createToDo(request, reply)
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
      description: 'Creating a new to do task'
    }
  },
  {
    method: 'POST',
    path: '/todos/{todoId}/check/',
    handler: (request, reply) ->
      ToDoHandler.checkToDo(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          todoId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Check a to do task'
    }
  },
  {
    method: 'POST',
    path: '/todos/{todoId}/uncheck/',
    handler: (request, reply) ->
      ToDoHandler.uncheckToDo(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          todoId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Uncheck a to do task'
    }
  },
  {
    method: 'PUT',
    path: '/todos/{todoId}/',
    handler: (request, reply) ->
      ToDoHandler.updateToDo(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required(),
          date: Joi.string().required()
        },
        params: {
          todoId: Joi.string().required()
        },
        payload: {
          text: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Update a to do task'
    }
  },
  {
    method: 'DELETE',
    path: '/todos/{todoId}/',
    handler: (request, reply) ->
      ToDoHandler.deleteToDo(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          todoId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Delete a specific to do task'
    }
  }
]

module.exports.routes = routes
