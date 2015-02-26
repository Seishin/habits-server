Moment = require 'moment'
When = require 'when'

Models = require '../models'
User = Models.User
Habit = Models.Habit
Counter = Models.Counter
UserStats = Models.UserStats

class StatsUtils
  defaultExpPerTask = 30
  defaultGoldPerTask = 10
  defaultHPPerTask = 10

  @expToNextLvl = (lvl) ->
    return 25 * lvl * (1 + lvl)

  @updateStatsByHabit = (habit, done) ->
    user = User.findOne({_id: habit.user}).exec()
    user.then (user) ->
      today = Moment(new Date()).format('YYYY-MM-DD')
      todayHabitsCount = 1

      for counter in habit.counters
        date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD')
        if date is today
          todayHabitsCount += 1

      stats = UserStats.findOne({_id: user.stats}).exec()
      stats.then (stats) ->
        exp = expGainByTimes todayHabitsCount
        stats.exp += exp

        if stats.exp >= StatsUtils.expToNextLvl stats.lvl
          stats.lvl += 1

        stats.hp -= defaultHPPerTask
        if stats.hp <= 0
          stats.hp = 0
          stats.alive = false

        stats.gold += goldGainByTimes todayHabitsCount
        stats.save()
        When(stats).then (stats) ->
          done()

  expGainByTimes = (times) ->
    if (defaultExpPerTask / times) <= 1
      return 0
    else
      return Math.floor(defaultExpPerTask / times)

  goldGainByTimes = (times) ->
    if (defaultGoldPerTask / times) <= 1
      return 0
    else
      return Math.floor(defaultGoldPerTask / times)

module.exports.StatsUtils = StatsUtils
