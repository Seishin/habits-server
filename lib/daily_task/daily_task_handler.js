(function() {
  var Counter, DailyTask, DailyTaskHandler, DailyTaskUtils, Models, Moment, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  DailyTask = Models.DailyTask;

  Counter = Models.DailyTaskCounter;

  When = require('when');

  Moment = require('moment');

  DailyTaskUtils = require('../daily_task/utils').DailyTaskUtils;

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  DailyTaskHandler = (function() {
    function DailyTaskHandler() {}

    DailyTaskHandler.createTask = function(request, reply) {
      var task;
      task = new DailyTask();
      task.text = request.payload.text;
      task.user = request.query.userId;
      task.save();
      return When(task).then(function(task) {
        return reply(DailyTaskUtils.getState(task, Moment(task.createdAt).format("YYYY-MM-DD"))).code(201);
      });
    };

    DailyTaskHandler.getTask = function(request, reply) {
      var task;
      task = DailyTask.findOne({
        _id: request.params.taskId,
        user: request.query.userId
      }).exec();
      return When(task).then(function(task) {
        return reply(DailyTaskUtils.getState(task, Moment(task.createdAt).format("YYYY-MM-DD"))).code(200);
      });
    };

    DailyTaskHandler.getAllTasks = function(request, reply) {
      var tasks;
      tasks = DailyTask.find({
        user: request.query.userId
      }).exec();
      return When(tasks).then(function(tasks) {
        var result, task, _i, _len;
        result = [];
        for (_i = 0, _len = tasks.length; _i < _len; _i++) {
          task = tasks[_i];
          result.push(DailyTaskUtils.getState(task, request.query.date));
        }
        return When.all(result).then(function(result) {
          return reply({
            tasks: tasks
          }).code(200);
        });
      });
    };

    DailyTaskHandler.checkTask = function(request, reply) {
      var task;
      task = DailyTask.findOne({
        _id: request.params.taskId,
        user: request.query.userId
      }).exec();
      return When(task).then(function(task) {
        var c;
        c = Counter();
        c.task = task;
        c.save();
        return UserStatsUtils.updateStats(task, function(done) {
          return reply(DailyTaskUtils.getState(task, request.query.date)).code(200);
        });
      });
    };

    DailyTaskHandler.updateTask = function(request, reply) {
      var task;
      task = DailyTask.findOne({
        _id: request.params.taskId,
        user: request.query.userId
      }).exec();
      return When(task).then(function(task) {
        task.text = request.payload.text;
        task.save();
        return reply(DailyTaskUtils.getState(task, request.query.date)).code(200);
      });
    };

    DailyTaskHandler.deleteTask = function(request, reply) {
      DailyTask.remove({
        _id: request.params.taskId,
        user: request.query.userId
      }, function(err, result) {
        if (!err) {
          return reply({
            id: request.params.taskId
          }).code(200);
        }
      }).exec();
      return Counter.remove({
        task: request.params.taskId
      }).exec();
    };

    return DailyTaskHandler;

  })();

  module.exports.DailyTaskHandler = DailyTaskHandler;

}).call(this);
