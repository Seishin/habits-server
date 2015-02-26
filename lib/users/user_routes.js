(function() {
  var Joi, UserHandler, routes;

  UserHandler = require('./user_handler').UserHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/users/{userId}',
      handler: function(request, reply) {
        return UserHandler.get(request, reply);
      },
      config: {
        validate: {
          params: {
            userId: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Get a specific user by his userId'
      }
    }, {
      method: 'GET',
      path: '/users',
      handler: function(request, reply) {
        return UserHandler.get(request, reply);
      },
      config: {
        tags: ['api'],
        description: 'Get a specific user by his token'
      }
    }, {
      method: 'GET',
      path: '/users/stats',
      handler: function(request, reply) {
        return UserHandler.getStats(request, reply);
      },
      config: {
        tags: ['api'],
        description: 'Get user\'s own stats'
      }
    }, {
      method: 'POST',
      path: '/users',
      handler: function(request, reply) {
        return UserHandler.create(request, reply);
      },
      config: {
        validate: {
          payload: {
            email: Joi.string().required(),
            password: Joi.string().required(),
            profileAvatar: Joi.string().optional(),
            name: Joi.string().optional()
          }
        },
        tags: ['api'],
        description: 'Create a new user'
      }
    }, {
      method: 'POST',
      path: '/users/login',
      handler: function(request, reply) {
        return UserHandler.login(request, reply);
      },
      config: {
        validate: {
          payload: {
            email: Joi.string().required(),
            password: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Login user'
      }
    }
  ];

  module.exports.routes = routes;

}).call(this);
