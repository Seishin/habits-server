(function() {
  var Counter, Habit, HabitHandler, Models, Moment, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.HabitsCounter;

  When = require('when');

  Moment = require('moment');

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  HabitHandler = (function() {
    var getState;

    function HabitHandler() {}

    HabitHandler.getAll = function(request, reply) {
      var habits;
      habits = Habit.find({
        user: request.query.userId
      }).sort({
        createdAt: -1
      }).exec();
      return When(habits).then(function(habits) {
        return reply({
          habits: habits
        }).code(200);
      });
    };

    HabitHandler.get = function(request, reply) {
      var habit;
      habit = Habit.findOne({
        _id: request.params.habitId,
        user: request.query.userId
      }).exec();
      return habit.then(function(habit) {
        return reply(getState(habit)).code(200);
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
          return reply(getState(habit)).code(200);
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

    getState = function(habit) {
      var counter, date, today, todayHabitsCount, _i, _len, _ref;
      habit = habit.toObject();
      today = Moment(new Date()).format('YYYY-MM-DD');
      todayHabitsCount = 0;
      _ref = habit.counters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        counter = _ref[_i];
        date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD');
        if (date === today) {
          todayHabitsCount += 1;
        }
      }
      if (todayHabitsCount < 3) {
        habit.state = 0;
      } else if (todayHabitsCount >= 3 && c < 6) {
        habit.state = 1;
      } else {
        habit.state = 2;
      }
      return habit;
    };

    return HabitHandler;

  })();

  module.exports.HabitHandler = HabitHandler;

}).call(this);
