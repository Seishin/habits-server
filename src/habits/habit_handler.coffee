Models = require '../models'
User = Models.User
Habit = Models.Habit
Counter = Models.HabitsCounter

When = require 'when'
Moment = require 'moment'
UserStatsUtils = require('../user_stats/utils').UserStatsUtils

class HabitHandler
  @getAll = (request, reply) ->
    habits = Habit.find({user: request.query.userId}).sort({createdAt: -1}).exec()

    When(habits).then (habits) ->
      result = []
      for habit in habits
        result = result.concat getState(habit, request.query.date)
        
      reply({habits: result}).code(200)

  @get = (request, reply) ->
    habit = Habit.findOne({_id: request.params.habitId, user: request.query.userId}).exec()
    habit.then (habit) ->
      reply(getState habit).code(200)

  @create = (request, reply) ->
    habit = new Habit()
    habit.text = request.payload.text
    habit.user = request.query.userId
    habit.save()

    When(habit).then (habit) ->
      reply(habit).code(201)

  @increment = (request, reply) ->
    habit = Habit.findOne({_id: request.params.habitId, user: request.query.userId}).populate('counters').exec()
        
    When(habit).then (habit) ->
      counter = new Counter()
      counter.habit = habit
      counter.save()
      
      habit.counters.push counter
      habit.save()

      UserStatsUtils.updateStatsByHabit(habit, (done) ->
        reply(getState(habit, request.query.date)).code(200)
      )

  @update = (request, reply) ->
    data = request.payload

    habit = Habit.findOne({_id: request.params.habitId, user: request.query.userId}).exec()
    When(habit).then (habit) ->
      if habit
        if data.text
          habit.text = data.text

        habit.save()

        reply(habit).code(200)
      else
        reply({message: 'Cannot find the habit!'}).code(404)
        
  @delete = (request, reply) ->
    Habit.remove({_id: request.params.habitId, user: request.query.userId}, (err, result) ->
      if err
        reply({message: err}).code(500)
      else
        reply({message: "Success!"}).code(200)
    ).exec()

    Counter.remove({habit: request.params.habitId}).exec()

  getState = (habit, selectedDate) ->
    habit = habit.toObject()
    
    todayHabitsCount = 0

    for counter in habit.counters
      date = Moment(new Date(counter.createdAt)).format('YYYY-MM-DD')
      if date is selectedDate
        todayHabitsCount += 1

    if todayHabitsCount < 3
      habit.state = 0
    else if todayHabitsCount >= 3 and todayHabitsCount < 6
      habit.state = 1
    else
      habit.state = 2

    return habit

module.exports.HabitHandler = HabitHandler
