(function() {
  var Token, User, UserHandler, When;

  User = require('../models').User;

  When = require('when');

  Token = require('random-token');

  UserHandler = (function() {
    function UserHandler() {}

    UserHandler.create = function(reply, data) {
      var user;
      user = User.findOne({
        email: data.email
      }).exec();
      return When(user).then(function(user) {
        if (user === null) {
          user = new User(data);
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

    UserHandler.login = function(reply, data) {
      var user;
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
