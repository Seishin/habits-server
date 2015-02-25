Models = require '../models'
User = Models.User
Habit = Models.Habit
Counter = Models.Counter
UserStats = Models.UserStats

class StatsUtils
  defaultExpPerTask = 30

  @expToNextLvl = (lvl) ->
    return 25 * lvl * (1 + lvl)

  @updateStatsByHabit = (habit) ->
    user = User.findOne({_id: habit.user}).exec()
    user.then (user) ->
      today = new Date()
      todayHabitsCount = 1

      for counter in habit.counters
        date = new Date(counter.createdAt)
        if date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getFullYear() == today.getFullYear()
          todayHabitsCount += 1

      stats = UserStats.findOne({_id: user.stats}).exec()
      stats.then (stats) ->
        exp = expGainByTimes todayHabitsCount
        stats.exp += exp
        
        if stats.exp >= StatsUtils.expToNextLvl stats.lvl
          stats.lvl += 1

        stats.save()

  expGainByTimes = (times) ->
    return Math.floor(defaultExpPerTask / times)

module.exports.StatsUtils = StatsUtils
