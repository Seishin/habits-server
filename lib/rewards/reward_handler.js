(function() {
  var Models, Reward, RewardHandler, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  Reward = Models.Reward;

  When = require('when');

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  RewardHandler = (function() {
    function RewardHandler() {}

    RewardHandler.createReward = function(request, reply) {
      var reward;
      reward = new Reward();
      reward.text = request.payload.text;
      reward.gold = request.payload.gold;
      reward.user = request.query.userId;
      reward.save();
      return When(reward).then(function(reward) {
        return reply(reward).code(201);
      });
    };

    RewardHandler.getReward = function(request, reply) {
      var reward;
      reward = Reward.findOne({
        _id: request.params.rewardId,
        user: request.query.userId
      }).exec();
      return When(reward).then(function(reward) {
        return reply(reward).code(200);
      });
    };

    RewardHandler.getAllRewards = function(request, reply) {
      var rewards;
      rewards = Reward.find({
        user: request.query.userId
      }).exec();
      return When(rewards).then(function(rewards) {
        return reply({
          rewards: rewards
        }).code(200);
      });
    };

    RewardHandler.buyReward = function(request, reply) {
      var reward;
      reward = Reward.findOne({
        _id: request.params.rewardId,
        user: request.query.userId
      }).exec();
      return When(reward).then(function(reward) {
        return UserStatsUtils.updateStats(reward, false, function(done) {
          return reply(reward).code(200);
        });
      });
    };

    RewardHandler.updateReward = function(request, reply) {
      var reward;
      reward = Reward.findOne({
        _id: request.params.rewardId,
        user: request.query.userId
      }).exec();
      return When(reward).then(function(reward) {
        if (request.payload.text !== null && request.payload.text !== reward.text) {
          reward.text = request.payload.text;
        }
        if (request.payload.gold !== null && request.payload.gold !== reward.gold) {
          reward.gold = request.payload.gold;
        }
        reward.save();
        return When(reward).then(function(reward) {
          return reply(reward).code(200);
        });
      });
    };

    RewardHandler.deleteReward = function(request, reply) {
      return Reward.remove({
        _id: request.params.rewardId,
        user: request.query.userId
      }, function(err, result) {
        if (!err) {
          return reply({
            id: request.params.rewardId
          }).code(200);
        }
      }).exec();
    };

    return RewardHandler;

  })();

  module.exports.RewardHandler = RewardHandler;

}).call(this);
