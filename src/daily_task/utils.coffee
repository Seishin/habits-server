Moment = require 'moment'
When = require 'when'

Models = require '../models'
Counter = Models.DailyTaskCounter

class DailyTaskUtils
  @getState = (task, date) ->
    task = task.toObject()
    toDate = Moment(date).add(1, 'days').format('YYYY-MM-DD')

    checkCounter = Counter.findOne({task: task, createdAt: {$gte: date, $lt: toDate}}).exec()
    When(checkCounter).then (checkCounter) ->
      if checkCounter
        task.state = 1
      else
        task.state = 0

      return task

module.exports.DailyTaskUtils = DailyTaskUtils
