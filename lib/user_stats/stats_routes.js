(function() {
  var Joi, UserStatsHandler, routes;

  UserStatsHandler = require('./stats_handler').UserStatsHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/stats/{userId}',
      handler: function(request, reply) {
        return UserStatsHandler.get(request, reply);
      },
      config: {
        validate: {
          params: {
            userId: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Get user\'s stats'
      }
    }
  ];

  module.exports.routes = routes;

}).call(this);
