(function() {
  var Counter, Habit, HabitHandler, HabitsUtils, Models, Moment, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.HabitsCounter;

  When = require('when');

  Moment = require('moment');

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  HabitsUtils = require('./utils').HabitsUtils;

  HabitHandler = (function() {
    function HabitHandler() {}

    HabitHandler.getAll = function(request, reply) {
      var habits;
      habits = Habit.find({
        user: request.query.userId
      }).sort({
        createdAt: -1
      }).exec();
      return When(habits).then(function(habits) {
        var habit, result, _i, _len;
        result = [];
        for (_i = 0, _len = habits.length; _i < _len; _i++) {
          habit = habits[_i];
          result.push(HabitsUtils.getState(habit, request.query.date));
        }
        return When.all(result).then(function(result) {
          return reply({
            habits: result
          }).code(200);
        });
      });
    };

    HabitHandler.get = function(request, reply) {
      var habit;
      habit = Habit.findOne({
        _id: request.params.habitId,
        user: request.query.userId
      }).exec();
      return habit.then(function(habit) {
        return reply(HabitsUtils.getState(habit)).code(200);
      });
    };

    HabitHandler.create = function(request, reply) {
      var habit;
      habit = new Habit();
      habit.text = request.payload.text;
      habit.user = request.query.userId;
      habit.save();
      return When(habit).then(function(habit) {
        return reply(habit).code(201);
      });
    };

    HabitHandler.increment = function(request, reply) {
      var habit;
      habit = Habit.findOne({
        _id: request.params.habitId,
        user: request.query.userId
      }).populate('counters').exec();
      return When(habit).then(function(habit) {
        var counter;
        counter = new Counter();
        counter.habit = habit;
        counter.save();
        habit.counters.push(counter);
        habit.save();
        return UserStatsUtils.updateStatsByHabit(habit, function(done) {
          return reply(HabitsUtils.getState(habit, request.query.date)).code(200);
        });
      });
    };

    HabitHandler.update = function(request, reply) {
      var data, habit;
      data = request.payload;
      habit = Habit.findOne({
        _id: request.params.habitId,
        user: request.query.userId
      }).exec();
      return When(habit).then(function(habit) {
        if (habit) {
          if (data.text) {
            habit.text = data.text;
          }
          habit.save();
          return reply(habit).code(200);
        } else {
          return reply({
            message: 'Cannot find the habit!'
          }).code(404);
        }
      });
    };

    HabitHandler["delete"] = function(request, reply) {
      Habit.remove({
        _id: request.params.habitId,
        user: request.query.userId
      }, function(err, result) {
        if (err) {
          return reply({
            message: err
          }).code(500);
        } else {
          return reply({
            message: "Success!"
          }).code(200);
        }
      }).exec();
      return Counter.remove({
        habit: request.params.habitId
      }).exec();
    };

    return HabitHandler;

  })();

  module.exports.HabitHandler = HabitHandler;

}).call(this);
