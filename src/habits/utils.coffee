Moment = require ('moment')
When = require 'when'

Models = require '../models'
Counter = Models.HabitCounter

class HabitsUtils
  @getState = (habit, selectedDate) ->
    habit = habit.toObject()
    
    counters = Counter.find({habit: habit._id}).exec()
    When(counters).then (counters) ->
      todayHabitsCount = 0

      for counter in counters
        date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD')
        if date is selectedDate
          todayHabitsCount += 1

      if todayHabitsCount < 3
        habit.state = 0
      else if todayHabitsCount >= 3 and todayHabitsCount < 6
        habit.state = 1
      else
        habit.state = 2

      return habit

module.exports.HabitsUtils = HabitsUtils
