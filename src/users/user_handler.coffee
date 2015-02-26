Models = require('../models')
User = Models.User
UserStats = Models.UserStats

When = require 'when'
Token = require 'random-token'

class UserHandler
  @get = (request, reply) ->
    if request.params.userId
      user = User.findOne({_id: request.params.userId}).exec()
    else
      user = User.findOne({token: request.headers.authorization}).exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'User with this userId wasn\'t found!'}).code(404)
      else
        if user.token is request.headers.authorization
          reply(user).code(200)
        else
          reply({
            email: user.email,
            name: user.name
          }).code(200)

  @getStats = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).populate('stats').exec()
    When(user).then (user) ->
      reply(user.stats).code(200)

  @create = (request, reply) ->
    data = request.payload
    user = User.findOne({email: data.email}).exec()

    When(user).then (user) ->
      if user is null
        user = new User(data)
        stats = new UserStats()
        stats.save()

        user.stats = stats
        user.token = Token(16)

        user.save()
        When.join(user, stats).then (result) ->
          reply({token: result[0].token}).code(201)
      else if user.email is data.email
        reply({message: 'The user already exists!'}).code(417)

  @login = (request, reply) ->
    data = request.payload
    user = User.findOne({email: data.email}).exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'User with this email wasn\'t found!'}).code(404)
      else if user.password != data.password
        reply({message: 'Wrong password!'}).code(401)
      else
        user.token = Token(16)
        user.save()
        reply({token: user.token}).code(202)
   
module.exports.UserHandler = UserHandler
