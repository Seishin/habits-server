(function() {
  var DailyTaskHandler, Joi, routes;

  DailyTaskHandler = require('./daily_task_handler').DailyTaskHandler;

  Joi = require('joi');

  routes = [
    {
      method: 'GET',
      path: '/daily-tasks/{taskId}/',
      handler: function(request, reply) {
        return DailyTaskHandler.getTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required()
          },
          params: {
            taskId: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Get a single specific daily task.'
      }
    }, {
      method: 'GET',
      path: '/daily-tasks/all/',
      handler: function(request, reply) {
        return DailyTaskHandler.getAllTasks(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required(),
            date: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Get all daily tasks.'
      }
    }, {
      method: 'POST',
      path: '/daily-tasks/',
      handler: function(request, reply) {
        return DailyTaskHandler.createTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required()
          },
          payload: Joi.object({
            text: Joi.string().required()
          }).unknown()
        },
        tags: ['api'],
        description: 'Creating a new daily task.'
      }
    }, {
      method: 'POST',
      path: '/daily-tasks/{taskId}/check/',
      handler: function(request, reply) {
        return DailyTaskHandler.checkTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required(),
            date: Joi.string().required()
          },
          params: Joi.object({
            taskId: Joi.string().required()
          }).unknown()
        },
        tags: ['api'],
        description: 'Set a specific task checked.'
      }
    }, {
      method: 'POST',
      path: '/daily-tasks/{taskId}/uncheck/',
      handler: function(request, reply) {
        return DailyTaskHandler.uncheckTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required(),
            date: Joi.string().required()
          },
          params: Joi.object({
            taskId: Joi.string().required()
          }).unknown()
        },
        tags: ['api'],
        description: 'Set a specific task unchecked.'
      }
    }, {
      method: 'PUT',
      path: '/daily-tasks/{taskId}/',
      handler: function(request, reply) {
        return DailyTaskHandler.updateTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required(),
            date: Joi.string().required()
          },
          params: {
            taskId: Joi.string().required()
          },
          payload: Joi.object({
            text: Joi.string().required()
          }).unknown()
        },
        tags: ['api'],
        description: 'Update a specific task.'
      }
    }, {
      method: 'DELETE',
      path: '/daily-tasks/{taskId}/',
      handler: function(request, reply) {
        return DailyTaskHandler.deleteTask(request, reply);
      },
      config: {
        validate: {
          query: {
            userId: Joi.string().required()
          },
          params: {
            taskId: Joi.string().required()
          }
        },
        tags: ['api'],
        description: 'Delete a specific task.'
      }
    }
  ];

  module.exports.routes = routes;

}).call(this);
