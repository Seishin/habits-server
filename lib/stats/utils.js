(function() {
  var Counter, Habit, Models, StatsUtils, User, UserStats;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.Counter;

  UserStats = Models.UserStats;

  StatsUtils = (function() {
    var defaultExpPerTask, expGainByTimes;

    function StatsUtils() {}

    defaultExpPerTask = 30;

    StatsUtils.expToNextLvl = function(lvl) {
      return 25 * lvl * (1 + lvl);
    };

    StatsUtils.updateStatsByHabit = function(habit) {
      var user;
      user = User.findOne({
        _id: habit.user
      }).exec();
      return user.then(function(user) {
        var counter, date, stats, today, todayHabitsCount, _i, _len, _ref;
        today = new Date();
        todayHabitsCount = 1;
        _ref = habit.counters;
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          counter = _ref[_i];
          date = new Date(counter.createdAt);
          if (date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear()) {
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
          if (stats.exp >= StatsUtils.expToNextLvl(stats.lvl)) {
            stats.lvl += 1;
          }
          return stats.save();
        });
      });
    };

    expGainByTimes = function(times) {
      return Math.floor(defaultExpPerTask / times);
    };

    return StatsUtils;

  })();

  module.exports.StatsUtils = StatsUtils;

}).call(this);