(function() {
  var HabitHandler, Joi, routes;

  HabitHandler = require('./habit_handler').HabitHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/habits/all/',
      handler: function(request, reply) {
        return HabitHandler.getAll(request, reply);
      },
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
    }, {
      method: 'GET',
      path: '/habits/{habitId}/',
      handler: function(request, reply) {
        return HabitHandler.get(request, reply);
      },
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
    }, {
      method: 'POST',
      path: '/habits/',
      handler: function(request, reply) {
        return HabitHandler.create(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required()
          },
          payload: {
            text: Joi.string().required(),
            state: Joi.number().optional()
          }
        },
        tags: ['api'],
        description: 'Creating a new habit for a user'
      }
    }, {
      method: 'POST',
      path: '/habits/increment/{habitId}/',
      handler: function(request, reply) {
        return HabitHandler.increment(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required(),
            date: Joi.string().optional()
          },
          params: {
            habitId: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Incrementing a user\'s habit'
      }
    }, {
      method: 'PUT',
      path: '/habits/{habitId}/',
      handler: function(request, reply) {
        return HabitHandler.update(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required()
          },
          params: {
            habitId: Joi.string().required()
          },
          payload: {
            text: Joi.string().optional(),
            state: Joi.number().optional()
          }
        },
        tags: ['api'],
        description: 'Update a specific user\'s habit'
      }
    }, {
      method: 'DELETE',
      path: '/habits/{habitId}/',
      handler: function(request, reply) {
        return HabitHandler["delete"](request, reply);
      },
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
  ];

  module.exports.routes = routes;

}).call(this);
