(function() {
  var Joi, ToDoHandler, routes;

  ToDoHandler = require('./todo_handler').ToDoHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/todos/{todoId}/',
      handler: function(request, reply) {
        return ToDoHandler.getToDo(request, reply);
      },
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
        description: 'Get a to do task'
      }
    }, {
      method: 'GET',
      path: '/todos/all/',
      handler: function(request, reply) {
        return ToDoHandler.getAllToDos(request, reply);
      },
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
    }, {
      method: 'POST',
      path: '/todos/',
      handler: function(request, reply) {
        return ToDoHandler.createToDo(request, reply);
      },
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
    }, {
      method: 'POST',
      path: '/todos/{todoId}/check/',
      handler: function(request, reply) {
        return ToDoHandler.checkToDo(request, reply);
      },
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
    }, {
      method: 'POST',
      path: '/todos/{todoId}/uncheck/',
      handler: function(request, reply) {
        return ToDoHandler.uncheckToDo(request, reply);
      },
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
    }, {
      method: 'PUT',
      path: '/todos/{todoId}/',
      handler: function(request, reply) {
        return ToDoHandler.updateToDo(request, reply);
      },
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
    }, {
      method: 'DELETE',
      path: '/todos/{todoId}/',
      handler: function(request, reply) {
        return ToDoHandler.deleteToDo(request, reply);
      },
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
  ];

  module.exports.routes = routes;

}).call(this);
