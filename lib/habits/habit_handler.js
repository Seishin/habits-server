(function() {
  var Counter, Habit, HabitHandler, Models, StatsUtils, User, When;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.HabitsCounter;

  When = require('when');

  StatsUtils = require('../stats/utils').StatsUtils;

  HabitHandler = (function() {
    function HabitHandler() {}

    HabitHandler.getAll = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).populate('habits').exec();
      return When(user).then(function(user) {
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else {
          return reply(user.habits).code(200);
        }
      });
    };

    HabitHandler.get = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).exec();
      return When(user).then(function(user) {
        var habit;
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else {
          habit = Habit.findOne({
            _id: request.params.habitId,
            user: user
          }).exec();
          return habit.then(function(habit) {
            var result;
            result = {
              text: habit.text,
              createdAt: habit.createdAt
            };
            return reply(result).code(200);
          });
        }
      });
    };

    HabitHandler.create = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).populate('habits').exec();
      return When(user).then(function(user) {
        var habit;
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else if (request.payload.text !== null) {
          habit = new Habit();
          habit.text = request.payload.text;
          habit.user = user;
          habit.save();
          user.habits.push(habit);
          user.save();
          return When(user, habit).then(function(user, habit) {
            return reply(user.habits).code(201);
          });
        }
      });
    };

    HabitHandler.increment = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).populate('stats').exec();
      return When(user).then(function(user) {
        var habit;
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else {
          habit = Habit.findOne({
            _id: request.params.habitId,
            user: user
          }).populate('counters').exec();
          return When(habit).then(function(habit) {
            var counter;
            counter = new Counter();
            counter.habit = habit;
            counter.save();
            habit.counters.push(counter);
            habit.save();
            return StatsUtils.updateStatsByHabit(habit, function(done) {
              return reply({
                message: "Success!"
              }).code(200);
            });
          });
        }
      });
    };

    HabitHandler.update = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).exec();
      return When(user).then(function(user) {
        var data, habit;
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else {
          data = request.payload;
          habit = Habit.findOne({
            _id: request.params.habitId,
            user: user
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
        }
      });
    };

    HabitHandler["delete"] = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization
      }).exec();
      user.then(function(user) {
        if (user === null) {
          return reply({
            message: 'Wrong token!'
          }).code(401);
        } else {
          return Habit.remove({
            _id: request.params.habitId
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
        }
      });
      return Counter.remove({
        habit: request.params.habitId
      }).exec();
    };

    return HabitHandler;

  })();

  module.exports.HabitHandler = HabitHandler;

}).call(this);
