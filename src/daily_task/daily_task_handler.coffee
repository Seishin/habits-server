Models = require '../models'
User = Models.User
DailyTask = Models.DailyTask
Counter = Models.DailyTaskCounter

When = require 'when'
Moment = require 'moment'
DailyTaskUtils = require('../daily_task/utils').DailyTaskUtils
UserStatsUtils = require('../user_stats/utils').UserStatsUtils

class DailyTaskHandler
  
  @createTask = (request, reply) ->
    task = new DailyTask()
    task.text = request.payload.text
    task.user = request.query.userId
    task.save()

    When(task). then (task) ->
      reply(DailyTaskUtils.getState(task, Moment(task.createdAt).format("YYYY-MM-DD"))).code(201)

  @getTask = (request, reply) ->
    task = DailyTask.findOne({_id: request.params.taskId, user: request.query.userId}).exec()

    When(task).then (task) ->
      reply(DailyTaskUtils.getState(task, Moment(task.createdAt).format("YYYY-MM-DD"))).code(200)

  @getAllTasks = (request, reply) ->
    tasks = DailyTask.find({user: request.query.userId}).exec()
    When(tasks).then (tasks) ->
      result = []
      for task in tasks
        result.push DailyTaskUtils.getState(task, request.query.date)

      When.all(result).then (result) ->
        reply({tasks: tasks}).code(200)

  @checkTask = (request, reply) ->
    task = DailyTask.findOne({_id: request.params.taskId, user: request.query.userId}).exec()
    When(task).then (task) ->
      c = Counter()
      c.task = task
      c.save()

      UserStatsUtils.updateStats(task, (done) ->
        reply(DailyTaskUtils.getState(task, request.query.date)).code(200)
      )

  @updateTask = (request, reply) ->
    task = DailyTask.findOne({_id: request.params.taskId, user: request.query.userId}).exec()
    When(task).then (task) ->
      task.text = request.payload.text
      task.save()

      reply(DailyTaskUtils.getState(task, request.query.date)).code(200)

  @deleteTask = (request, reply) ->
    DailyTask.remove({_id: request.params.taskId, user: request.query.userId}, (err, result) ->
      if not err
        reply({id: request.params.taskId}).code(200)
    ).exec()

    Counter.remove({task: request.params.taskId}).exec()

module.exports.DailyTaskHandler = DailyTaskHandler
