Models = require '../models'
User = Models.User
ToDo = Models.ToDo
Counter = Models.ToDoCounter

When = require 'when'
Moment = require 'moment'
ToDoUtils = require('../todo/utils').ToDoUtils
UserStatsUtils = require('../user_stats/utils').UserStatsUtils

class ToDoHandler

  @createToDo = (request, reply) ->
    todo = new ToDo()
    todo.text = request.payload.text
    todo.user = request.query.userId
    todo.save()

    When(todo).then (todo) ->
      reply(ToDoUtils.getState(todo)).code(201)

  @getToDo = (request, reply) ->
    todo = ToDo.findOne({_id: request.params.todoId, user: request.query.userId}).exec()
    When(todo).then (todo) ->
      reply(ToDoUtils.getState(todo)).code(200)

  @getAllToDos = (request, reply) ->
    todos = ToDo.find({user: request.query.userId}).exec()
    When(todos).then (todos) ->
      result = []
      for todo in todos
        result.push ToDoUtils.getState(todo, request.query.date)

      When.all(result).then (result) ->
        reply({todos: result}).code(200)

  @checkToDo = (request, reply) ->
    todo = ToDo.findOne({_id: request.params.todoId, user: request.query.userId}).exec()
    When(todo).then (todo) ->
      c = Counter()
      c.todo = todo
      c.save()

      UserStatsUtils.updateStats(todo, true, (done) ->
        reply(ToDoUtils.getState(todo, request.query.date)).code(200)
      )

   @uncheckToDo = (request, reply) ->
    todo = ToDo.findOne({_id: request.params.todoId, user: request.query.userId}).exec()
    When(todo).then (todo) ->
      Counter.remove({todo: todo, createdAt: {$gte: request.query.date}}, (err, result) ->
        if not err
          UserStatsUtils.updateStats(todo, false, (done) ->
            reply(ToDoUtils.getState(todo, request.query.date)).code(200)
          )
        else
          reply({message: err}).code(409)
      )

  @updateToDo = (request, reply) ->
    todo = ToDo.findOne({_id: request.params.todoId, user: request.query.userId}).exec()
    When(todo).then (todo) ->
      todo.text = request.payload.text
      todo.save()

      reply(ToDoUtils.getState(todo, request.query.date)).code(200)

  @deleteToDo = (request, reply) ->
    ToDo.remove({_id: request.params.todoId, user: request.query.userId}, (err, result) ->
      if not err
        reply({id: request.params.todoId}).code(200)
    ).exec()

    Counter.remove({task: request.params.todoId}).exec()

module.exports.ToDoHandler = ToDoHandler
