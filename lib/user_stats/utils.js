(function() {
  var Counter, Habit, Models, Moment, User, UserStats, UserStatsUtils, When;

  Moment = require('moment');

  When = require('when');

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.Counter;

  UserStats = Models.UserStats;

  UserStatsUtils = (function() {
    var defaultExpPerTask, defaultGoldPerTask, expGainByTimes, goldGainByTimes;

    function UserStatsUtils() {}

    defaultExpPerTask = 30;

    defaultGoldPerTask = 10;

    UserStatsUtils.expToNextLvl = function(lvl) {
      return 25 * lvl * (1 + lvl);
    };

    UserStatsUtils.updateStatsByHabit = function(habit, done) {
      var user;
      user = User.findOne({
        _id: habit.user
      }).exec();
      return user.then(function(user) {
        var counter, date, stats, today, todayHabitsCount, _i, _len, _ref;
        today = Moment(new Date()).format('YYYY-MM-DD');
        todayHabitsCount = 1;
        _ref = habit.counters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          counter = _ref[_i];
          date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD');
          if (date === today) {
            todayHabitsCount += 1;
          }
        }
        stats = UserStats.findOne({
          _id: user.stats
        }).exec();
        return stats.then(function(stats) {
          var exp;
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
