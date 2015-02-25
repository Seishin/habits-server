(function() {
  var Counter, Habit, Models, StatsUtils, User;

  Models = require('../models');

  User = Models.User;

  Habit = Models.Habit;

  Counter = Models.Counter;

  StatsUtils = (function() {
    var defaultExpPerTask;

    function StatsUtils() {}

    defaultExpPerTask = 50;

    StatsUtils.expToNextLvl = function(lvl) {
      return 25 * lvl * (1 + lvl);
    };

    StatsUtils.updateStatsByHabit = function(habit) {
      var user;
      user = User.findOne({
        _id: habit.user
      }).exec();
      return user.then(function(user) {
        console.dir(user);
        return console.dir(habit);
      });
    };

    return StatsUtils;

  })();

  module.exports.StatsUtils = StatsUtils;

}).call(this);
