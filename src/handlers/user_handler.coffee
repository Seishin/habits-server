User = require('../models').User

When = require 'when'
Token = require 'random-token'

class UserHandler
  @create = (reply, data) ->
    user = User.findOne({email: data.email}).exec()

    When(user).then (user) ->
      if user is null
        user = new User(data)
    
        user.token = Token(16)
        user.save()

        reply({token: user.token}).code(201)
      else if user.email is data.email
        reply({message: 'The user already exists!'}).code(417)

  @login = (reply, data) ->
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
