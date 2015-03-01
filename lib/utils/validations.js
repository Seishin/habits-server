(function() {
  var User, When, routes, validateRequest;

  When = require('when');

  User = require('../models').User;

  routes = require('../routes').routes;

  validateRequest = function(request, reply) {
    var token, user, userId;
    token = request.headers.authorization;
    userId = request.query.userId;
    if (userId) {
      user = User.findOne({
        _id: userId,
        token: token
      }).exec();
      return When(user).then(function(user) {
        if (user) {
          return reply["continue"]();
        } else {
          return reply({
            message: 'Wrong or missing authorization token'
          }).code(401);
        }
      });
    } else {
      return reply["continue"]();
    }
  };

  module.exports.validateRequest = validateRequest;

}).call(this);
