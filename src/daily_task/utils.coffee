Moment = require 'moment'
When = require 'when'

Models = require '../models'
Counter = Models.DailyTaskCounter

class DailyTaskUtils
  @getState = (task, date) ->
    task = task.toObject()

    checkCounter = Counter.findOne({task: task, createdAt: {$gte: date}}).exec()
    When(checkCounter).then (checkCounter) ->
      if checkCounter
        task.state = 1
      else
        task.state = 0

      return task

module.exports.DailyTaskUtils = DailyTaskUtils
