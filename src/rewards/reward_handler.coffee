Models = require '../models'
User = Models.User
Reward = Models.Reward

When = require 'when'
UserStatsUtils = require('../user_stats/utils').UserStatsUtils

class RewardHandler

  @createReward = (request, reply) ->
    reward = new Reward()
    reward.text = request.payload.text
    reward.gold = request.payload.gold
    reward.user = request.query.userId
    reward.save()

    When(reward).then (reward) ->
      reply(reward).code(201)

  @getReward = (request, reply) ->
    reward = Reward.findOne({_id: request.params.rewardId, user: request.query.userId}).exec()
    When(reward).then (reward) ->
      reply(reward).code(200)

  @getAllRewards = (request, reply) ->
    rewards = Reward.find({user: request.query.userId}).exec()
    When(rewards).then (rewards) ->
      reply({rewards: rewards}).code(200)

  @buyReward = (request, reply) ->
    reward = Reward.findOne({_id: request.params.rewardId, user: request.query.userId}).exec()
    When(reward).then (reward) ->
      UserStatsUtils.updateStats(reward, false, (done) ->
        reply(reward).code(200)
      )

  @updateReward = (request, reply) ->
    reward = Reward.findOne({_id: request.params.rewardId, user: request.query.userId}).exec()
    When(reward).then (reward) ->
      if request.payload.text != null and request.payload.text != reward.text
        reward.text = request.payload.text

      if request.payload.gold != null and request.payload.gold != reward.gold
        reward.gold = request.payload.gold

      reward.save()
      When(reward).then (reward) ->
        reply(reward).code(200)

  @deleteReward = (request, reply) ->
    Reward.remove({_id: request.params.rewardId, user: request.query.userId}, (err, result) ->
      if not err
        reply({id: request.params.rewardId}).code(200)
    ).exec()

module.exports.RewardHandler = RewardHandler
