(function() {
  var User, When, userRoutes, validateToken;

  When = require('when');

  User = require('../models').User;

  userRoutes = require('../users/user_routes').routes;

  validateToken = function(request, reply) {
    var route, token, user, _i, _len;
    for (_i = 0, _len = userRoutes.length; _i < _len; _i++) {
      route = userRoutes[_i];
      if (route.path.split('/')[1] === request.path.split('/')[1]) {
        reply["continue"]();
        break;
      }
    }
    token = request.headers.authorization;
    if (token) {
      user = User.findOne({
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
      return reply({
        message: 'Wrong or missing authorization token'
      }).code(401);
    }
  };

  module.exports.validateToken = validateToken;

}).call(this);
