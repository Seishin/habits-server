(function() {
  var Counter, DailyTaskUtils, Models, Moment, When;

  Moment = require('moment');

  When = require('when');

  Models = require('../models');

  Counter = Models.DailyTaskCounter;

  DailyTaskUtils = (function() {
    function DailyTaskUtils() {}

    DailyTaskUtils.getState = function(task, date) {
      var checkCounter, toDate;
      task = task.toObject();
      toDate = Moment(date).add(1, 'days').format('YYYY-MM-DD');
      checkCounter = Counter.findOne({
        task: task,
        createdAt: {
          $gte: date,
          $lt: toDate
        }
      }).exec();
      return When(checkCounter).then(function(checkCounter) {
        if (checkCounter) {
          task.state = 1;
        } else {
          task.state = 0;
        }
        return task;
      });
    };

    return DailyTaskUtils;

  })();

  module.exports.DailyTaskUtils = DailyTaskUtils;

}).call(this);
