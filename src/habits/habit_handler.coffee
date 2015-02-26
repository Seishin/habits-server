Models = require '../models'
User = Models.User
Habit = Models.Habit
Counter = Models.HabitsCounter

When = require 'when'
StatsUtils = require('../stats/utils').StatsUtils

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
    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        habit = Habit.findOne({_id: request.params.habitId, user: user}).exec()
        habit.then (habit) ->
          result = {
            text: habit.text,
            createdAt: habit.createdAt
          }
          reply(result).code(200)

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
        When(user, habit).then (user, habit) ->
          reply(user.habits).code(201)

  @increment = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).populate('stats').exec()

    When(user).then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        habit = Habit.findOne({_id: request.params.habitId, user: user}).populate('counters').exec()
        
        When(habit).then (habit) ->
          counter = new Counter()
          counter.habit = habit
          counter.save()
          
          habit.counters.push counter
          habit.save()

          StatsUtils.updateStatsByHabit(habit, (done) ->
            reply({message: "Success!"}).code(200)
          )

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

            habit.save()

            reply(habit).code(200)
          else
            reply({message: 'Cannot find the habit!'}).code(404)
        
  @delete = (request, reply) ->
    user = User.findOne({token: request.headers.authorization}).exec()

    user.then (user) ->
      if user is null
        reply({message: 'Wrong token!'}).code(401)
      else
        Habit.remove({_id: request.params.habitId}, (err, result) ->
          if err
            reply({message: err}).code(500)
          else
            reply({message: "Success!"}).code(200)
        ).exec()

    Counter.remove({habit: request.params.habitId}).exec()

module.exports.HabitHandler = HabitHandler
