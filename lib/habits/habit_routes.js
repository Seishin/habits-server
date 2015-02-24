(function() {
  var HabitHandler, Joi, routes;

  HabitHandler = require('./habit_handler').HabitHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/habits/all',
      handler: function(request, reply) {
        return HabitHandler.getAll(request, reply);
      }
    }, {
      method: 'GET',
      path: '/habits/{habitId}',
      handler: function(request, reply) {
        return HabitHandler.get(request, reply);
      },
      config: {
        validate: {
          params: {
            habitId: Joi.string().required()
          }
        }
      }
    }, {
      method: 'POST',
      path: '/habits/create',
      handler: function(request, reply) {
        return HabitHandler.create(request, reply);
      },
      config: {
        validate: {
          payload: {
            text: Joi.string().required()
          }
        }
      }
    }, {
      method: 'POST',
      path: '/habits/increment/{habitId}',
      handler: function(request, reply) {
        return HabitHandler.increment(request, reply);
      },
      config: {
        validate: {
          params: {
            habitId: Joi.string().required()
          }
        }
      }
    }, {
      method: 'PUT',
      path: '/habits/update/{habitId}',
      handler: function(request, reply) {
        return HabitHandler.update(request, reply);
      },
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
    }, {
      method: 'DELETE',
      path: '/habits/delete/{habitId}',
      handler: function(request, reply) {
        return HabitHandler["delete"](request, reply);
      },
      config: {
        validate: {
          params: {
            habitId: Joi.string().required()
          }
        }
      }
    }
  ];

  module.exports.routes = routes;

}).call(this);
