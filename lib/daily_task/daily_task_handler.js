(function() {
  var Counter, DailyTask, DailyTaskHandler, Models, Moment, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  DailyTask = Models.DailyTask;

  Counter = Models.DailyTaskCounter;

  When = require('when');

  Moment = require('moment');

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  DailyTaskHandler = (function() {
    function DailyTaskHandler() {}

    DailyTaskHandler.createOne = function(request, reply) {
      var task;
      task = new DailyTask();
      task.text = request.payload.text;
      task.user = request.query.userId;
      task.save();
      return When(task).then(function(task) {
        return reply(task).code(201);
      });
    };

    DailyTaskHandler.getOne = function(request, reply) {
      var task;
      task = DailyTask.findOne({
        _id: request.params.taskId,
        user: request.query.userId
      }).exec();
      return When(task).then(function(task) {
        return reply(task).code(200);
      });
    };

    DailyTaskHandler.getAll = function(request, reply) {
      var tasks;
      tasks = DailyTask.find({
        user: request.query.userId
      }).exec();
      return When(tasks).then(function(tasks) {
        return reply({
          tasks: tasks
        }).code(200);
      });
    };

    return DailyTaskHandler;

  })();

  module.exports.DailyTaskHandler = DailyTaskHandler;

}).call(this);
