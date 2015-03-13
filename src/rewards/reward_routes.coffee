RewardHandler = require('./reward_handler').RewardHandler
Joi = require 'joi'

routes = [
  {
    method: 'GET',
    path: '/rewards/{rewardId}/',
    handler: (request, reply) ->
      RewardHandler.getReward(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          rewardId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get a reward'
    }
  },
  {
    method: 'GET',
    path: '/rewards/all/',
    handler: (request, reply) ->
      RewardHandler.getAllRewards(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Get all rewards'
    }
  },
  {
    method: 'POST',
    path: '/rewards/',
    handler: (request, reply) ->
      RewardHandler.createReward(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        payload: {
          text: Joi.string().required(),
          gold: Joi.number().required()
        }
      },
      tags: ['api'],
      description: 'Create a reward'
    }
  },
  {
    method: 'POST',
    path: '/rewards/buy/{rewardId}/',
    handler: (request, reply) ->
      RewardHandler.buyReward(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          rewardId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Buy a reward'
    }
  },
  {
    method: 'PUT',
    path: '/rewards/{rewardId}/',
    handler: (request, reply) ->
      RewardHandler.updateReward(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          rewardId: Joi.string().required()
        },
        payload: {
          text: Joi.string().optional(),
          gold: Joi.number().optional()
        }
      },
      tags: ['api'],
      description: 'Update a reward'
    }
  },
  {
    method: 'DELETE',
    path: '/rewards/{rewardId}/',
    handler: (request, reply) ->
      RewardHandler.deleteReward(request, reply)
    ,
    config: {
      validate: {
        query: {
          userId: Joi.string().required()
        },
        params: {
          rewardId: Joi.string().required()
        }
      },
      tags: ['api'],
      description: 'Delete a reward'
    }
  }
]

module.exports.routes = routes
