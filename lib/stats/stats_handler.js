(function() {
  var Models, User, UserStats, UserStatsHandler, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  UserStats = Models.UserStats;

  When = require('when');

  UserStatsUtils = require('./utils').UserStatsUtils;

  UserStatsHandler = (function() {
    function UserStatsHandler() {}

    UserStatsHandler.get = function(request, reply) {
      var user;
      user = User.findOne({
        token: request.headers.authorization,
        _id: request.params.userId
      }).populate('stats').exec();
      return When(user).then(function(user) {
        var statsObj;
        statsObj = user.stats.toObject();
        statsObj.nextLvlExp = UserStatsUtils.expToNextLvl(statsObj.lvl);
        return reply(statsObj).code(200);
      });
    };

    return UserStatsHandler;

  })();

  module.exports.UserStatsHandler = UserStatsHandler;

}).call(this);
