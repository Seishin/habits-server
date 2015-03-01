(function() {
  var Joi, StatsHandler, routes;

  StatsHandler = require('./stats_handler').StatsHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/stats/{userId}',
      handler: function(request, reply) {
        return StatsHandler.get(request, reply);
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
