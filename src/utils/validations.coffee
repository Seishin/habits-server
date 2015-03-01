When = require 'when'
User = require('../models').User

routes = require('../routes').routes

validateRequest = (request, reply) ->
  token = request.headers.authorization
  userId = request.query.userId

  if userId
    user = User.findOne({_id: userId, token: token}).exec()
    When(user).then (user) ->
      if user
        reply.continue()
      else
        reply({message: 'Wrong or missing authorization token'}).code(401)
  else
    reply.continue()

module.exports.validateRequest = validateRequest
