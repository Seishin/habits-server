(function() {
  var Models, Token, User, UserHandler, UserStats, When;

  Models = require('../models');

  User = Models.User;

  UserStats = Models.UserStats;

  When = require('when');

  Token = require('random-token');

  UserHandler = (function() {
    function UserHandler() {}

    UserHandler.get = function(request, reply) {
      var user;
      user = User.findOne({
        _id: request.params.userId
      }).exec();
      return When(user).then(function(user) {
        if (user === null) {
          return reply({
            message: 'User with this userId wasn\'t found!'
          }).code(404);
        } else {
          if (user.token === request.headers.authorization) {
            return reply(user).code(200);
          } else {
            return reply({
              email: user.email,
              name: user.name
            }).code(200);
          }
        }
      });
    };

    UserHandler.create = function(request, reply) {
      var data, user;
      data = request.payload;
      user = User.findOne({
        email: data.email
      }).exec();
      return When(user).then(function(user) {
        var stats;
        if (user === null) {
          user = new User(data);
          stats = new UserStats();
          stats.save();
          user.stats = stats;
          user.token = Token(16);
          user.save();
          return reply({
            token: user.token
          }).code(201);
        } else if (user.email === data.email) {
          return reply({
            message: 'The user already exists!'
          }).code(417);
        }
      });
    };

    UserHandler.login = function(request, reply) {
      var data, user;
      data = request.payload;
      user = User.findOne({
        email: data.email
      }).exec();
      return When(user).then(function(user) {
        if (user === null) {
          return reply({
            message: 'User with this email wasn\'t found!'
          }).code(404);
        } else if (user.password !== data.password) {
          return reply({
            message: 'Wrong password!'
          }).code(401);
        } else {
          user.token = Token(16);
          user.save();
          return reply({
            token: user.token
          }).code(202);
        }
      });
    };

    return UserHandler;

  })();

  module.exports.UserHandler = UserHandler;

}).call(this);
