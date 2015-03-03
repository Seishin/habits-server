(function() {
  var Models, StatsUtils, Token, User, UserHandler, UserStats, When;

  Models = require('../models');

  User = Models.User;

  UserStats = Models.UserStats;

  When = require('when');

  Token = require('random-token');

  StatsUtils = require('../stats/utils').StatsUtils;

  UserHandler = (function() {
    var findUserByAuthToken, findUserById, replyWithNotFound, replyWithPrivateProfile, replyWithPublicProfile, userHasAuthToken;

    function UserHandler() {}

    UserHandler.getUserProfileById = function(request, reply) {
      this.request = request;
      this.reply = reply;
      if (findUserById()) {
        return replyWithPrivateProfile();
      } else {
        return replyWithNotFound();
      }
    };

    UserHandler.getUserProfileByToken = function(request, reply) {
      this.request = request;
      this.reply = reply;
      if (findUserByAuthToken()) {
        return replyWithPrivateProfile();
      } else {
        return replyWithNotFound();
      }
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
          return When.join(user, stats).then(function(result) {
            user = result[0].toObject();
            delete user.password;
            return reply(user).code(201);
          });
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
          return When(user).then(function(user) {
            user = user.toObject();
            delete user.password;
            return reply(user).code(202);
          });
        }
      });
    };

    findUserById = function() {
      return UserHandler.user = When(User.findOne({
        _id: UserHandler.request.params.userId
      }).exec()).then(function(user) {
        return user;
      });
    };

    findUserByAuthToken = function() {
      var req;
      req = {
        _id: UserHandler.request.params.userId,
        token: UserHandler.request.headers.authorization
      };
      return UserHandler.user = When(User.findOne(req).exec()).then(function(user) {
        return user;
      });
    };

    userHasAuthToken = function() {
      if (UserHandler.user.token === UserHandler.request.headers.authorization) {
        return true;
      } else {
        return false;
      }
    };

    replyWithPrivateProfile = function() {
      return UserHandler.reply(UserHandler.user).code(200);
    };

    replyWithPublicProfile = function() {
      return UserHandler.reply({
        email: user.email,
        name: user.name
      }).code(200);
    };

    replyWithNotFound = function() {
      return UserHandler.reply({
        message: 'Not found!'
      }).code(404);
    };

    return UserHandler;

  })();

  module.exports.UserHandler = UserHandler;

}).call(this);
