(function() {
  var DailyTask, Habit, Models, Moment, User, UserStats, UserStatsUtils, When;

  Moment = require('moment');

  When = require('when');

  Models = require('../models');

  User = Models.User;

  UserStats = Models.UserStats;

  Habit = Models.Habit;

  DailyTask = Models.DailyTask;

  UserStatsUtils = (function() {
    var defaultExpPerTask, defaultGoldPerTask, expGainByTimes, goldGainByTimes;

    function UserStatsUtils() {}

    defaultExpPerTask = 30;

    defaultGoldPerTask = 10;

    UserStatsUtils.expToNextLvl = function(lvl) {
      return 25 * lvl * (1 + lvl);
    };

    UserStatsUtils.updateStats = function(object, done) {
      var user;
      user = User.findOne({
        _id: object.user
      }).exec();
      return user.then(function(user) {
        var stats;
        stats = UserStats.findOne({
          _id: user.stats
        }).exec();
        return stats.then(function(stats) {
          var counter, date, exp, today, todayHabitsCount, _i, _len, _ref;
          if (object instanceof Habit) {
            today = Moment(new Date()).format('YYYY-MM-DD');
            todayHabitsCount = 1;
            _ref = object.counters;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
              counter = _ref[_i];
              date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD');
              if (date === today) {
                todayHabitsCount += 1;
              }
            }
            exp = expGainByTimes(todayHabitsCount);
            stats.exp += exp;
            if (stats.exp >= UserStatsUtils.expToNextLvl(stats.lvl)) {
              stats.lvl += 1;
            }
            if (stats.hp <= 0) {
              stats.hp = 0;
              stats.alive = false;
            }
            stats.gold += goldGainByTimes(todayHabitsCount);
          } else if (object instanceof DailyTask) {
            stats.exp += defaultExpPerTask;
            stats.gold += defaultGoldPerTask;
          }
          stats.save();
          return When(stats).then(function(stats) {
            return done();
          });
        });
      });
    };

    expGainByTimes = function(times) {
      if ((defaultExpPerTask / times) <= 1) {
        return 0;
      } else {
        return Math.floor(defaultExpPerTask / times);
      }
    };

    goldGainByTimes = function(times) {
      if ((defaultGoldPerTask / times) <= 1) {
        return 0;
      } else {
        return Math.floor(defaultGoldPerTask / times);
      }
    };

    return UserStatsUtils;

  })();

  module.exports.UserStatsUtils = UserStatsUtils;

}).call(this);
