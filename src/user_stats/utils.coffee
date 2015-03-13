Moment = require 'moment'
When = require 'when'

Models = require '../models'
User = Models.User
UserStats = Models.UserStats
Habit = Models.Habit
DailyTask = Models.DailyTask
ToDo = Models.ToDo
Reward = Models.Reward

class UserStatsUtils
  defaultExpPerTask = 30
  defaultGoldPerTask = 10

  @expToNextLvl = (lvl) ->
    return 25 * lvl * (1 + lvl)

  @updateStats = (object, inc, done) ->
    user = User.findOne({_id: object.user}).exec()
    user.then (user) ->
      stats = UserStats.findOne({_id: user.stats}).exec()
      stats.then (stats) ->
        if object instanceof Habit
          today = Moment(new Date()).format('YYYY-MM-DD')
          todayHabitsCount = 1

          for counter in object.counters
            date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD')
            if date is today
              todayHabitsCount += 1

          exp = expGainByTimes todayHabitsCount
          stats.exp += exp

          if stats.hp <= 0
            stats.hp = 0
            stats.alive = false

          stats.gold += goldGainByTimes todayHabitsCount
        else if ((object instanceof DailyTask) or (object instanceof ToDo))
          if inc
            stats.exp += defaultExpPerTask
            stats.gold += defaultGoldPerTask
          else
            stats.exp -= defaultExpPerTask
            stats.gold -= defaultGoldPerTask
        else if object instanceof Reward
          stats.gold -= object.gold

        if stats.exp > UserStatsUtils.expToNextLvl stats.lvl
            stats.lvl += 1
        else if stats.exp <= UserStatsUtils.expToNextLvl(stats.lvl - 1)
          stats.lvl -= 1

        if stats.gold < 0
          stats.gold = 0

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

module.exports.UserStatsUtils = UserStatsUtils
