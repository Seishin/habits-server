Models = require '../models'
User = Models.User
DailyTask = Models.DailyTask
Counter = Models.DailyTaskCounter

When = require 'when'
Moment = require 'moment'
UserStatsUtils = require('../user_stats/utils').UserStatsUtils

class DailyTaskHandler
  
  @createOne = (request, reply) ->
    task = new DailyTask()
    task.text = request.payload.text
    task.user = request.query.userId
    task.save()

    When(task). then (task) ->
      reply(task).code(201)

  @getOne = (request, reply) ->
    task = DailyTask.findOne({_id: request.params.taskId, user: request.query.userId}).exec()
    When(task).then (task) ->
      reply(task).code(200)

  @getAll = (request, reply) ->
    tasks = DailyTask.find({user: request.query.userId}).exec()
    When(tasks).then (tasks) ->
      reply({tasks: tasks}).code(200)

module.exports.DailyTaskHandler = DailyTaskHandler
