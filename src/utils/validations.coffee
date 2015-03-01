When = require 'when'
User = require('../models').User

userRoutes = require('../users/user_routes').routes

validateToken = (request, reply) ->
  for route in userRoutes
    if route.path.split('/')[1] == request.path.split('/')[1]
      reply.continue()
      break

  token = request.headers.authorization

  if token
    user = User.findOne({token: token}).exec()
    When(user).then (user) ->
      if user
        reply.continue()
      else
        reply({message: 'Wrong or missing authorization token'}).code(401)
  else
    reply({message: 'Wrong or missing authorization token'}).code(401)

module.exports.validateToken = validateToken
