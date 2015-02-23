Models = require '../models'
User = Models.User
Habit = Models.Habit

When = require 'when'

class HabitHandler
  @getAll = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).populate('habits').exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        reply(user.habits).code(200)

  @get = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).exec()
    user.then (user) ->
      habit = Habit.findOne({_id: request.params.habitId, user: user}).exec()
      reply(habit).code(200)

  @create = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).populate('habits').exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else if request.payload.text != null
        habit = new Habit()
        habit.text = request.payload.text
        habit.user = user
        habit.save()

        user.habits.push habit
        user.save()

        reply(user).code(200)

  @update = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        data = request.payload

        habit = Habit.findOne({_id: request.params.habitId, user: user}).exec()

        When(habit).then (habit) ->
          if habit
            if data.text
              habit.text = data.text

            if data.counter
              habit.counter = data.counter

            habit.save()

            reply(habit).code(200)
          else
            reply({message: 'Cannot find the habit!'}).code(404)
        
  @delete = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        Habit.remove({_id: request.params.habitId}, (err, result) ->
          if err
            reply({message: err}).code(500)
          else
            reply({message: "Success!"}).code(200)
        ).exec()


module.exports.HabitHandler = HabitHandler
