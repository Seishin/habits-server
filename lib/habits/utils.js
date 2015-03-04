(function() {
  var Counter, HabitsUtils, Models, Moment, When;

  Moment = require('moment');

  When = require('when');

  Models = require('../models');

  Counter = Models.HabitsCounter;

  HabitsUtils = (function() {
    function HabitsUtils() {}

    HabitsUtils.getState = function(habit, selectedDate) {
      var counters;
      habit = habit.toObject();
      counters = Counter.find({
        habit: habit
      }).exec();
      return When(counters).then(function(counters) {
        var counter, date, todayHabitsCount, _i, _len;
        todayHabitsCount = 0;
        for (_i = 0, _len = counters.length; _i < _len; _i++) {
          counter = counters[_i];
          date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD');
          if (date === selectedDate) {
            todayHabitsCount += 1;
          }
        }
        if (todayHabitsCount < 3) {
          habit.state = 0;
        } else if (todayHabitsCount >= 3 && todayHabitsCount < 6) {
          habit.state = 1;
        } else {
          habit.state = 2;
        }
        return habit;
      });
    };

    return HabitsUtils;

  })();

  module.exports.HabitsUtils = HabitsUtils;

}).call(this);
