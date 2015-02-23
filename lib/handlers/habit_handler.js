(function() {
  var Habit, HabitHandler, Models, User, When;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  When = require('when');

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
      return user.then(function(user) {
        var habit;
        habit = Habit.findOne({
          _id: request.params.habitId,
          user: user
        }).exec();
        return reply(habit).code(200);
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
          return reply(user).code(200);
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
              if (data.counter) {
                habit.counter = data.counter;
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
      return When(user).then(function(user) {
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
    };

    return HabitHandler;

  })();

  module.exports.HabitHandler = HabitHandler;

}).call(this);
