(function() {
  var Counter, Habit, Models, Moment, StatsUtils, User, UserStats, When;

  Moment = require('moment');

  When = require('when');

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

    StatsUtils.updateStatsByHabit = function(habit, done) {
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
          if (stats.exp >= StatsUtils.expToNextLvl(stats.lvl)) {
            stats.lvl += 1;
          }
          stats.save();
          return When(stats).then(function(stats) {
            return done();
          });
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
