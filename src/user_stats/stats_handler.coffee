Models = require '../models'
User = Models.User
UserStats = Models.UserStats

When = require 'when'
UserStatsUtils = require('./utils').UserStatsUtils

class UserStatsHandler
  @get = (request, reply) ->
    user = User.findOne({token: request.headers.authorization, _id: request.params.userId}).populate('stats').exec()

    When(user).then (user) ->
      statsObj = user.stats.toObject()
      statsObj.nextLvlExp = UserStatsUtils.expToNextLvl statsObj.lvl
      reply(statsObj).code(200)
    
module.exports.UserStatsHandler = UserStatsHandler
