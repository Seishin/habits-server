Moment = require 'moment'
When = require 'when'

Models = require '../models'
Counter = Models.ToDoCounter

class ToDoUtils
  @getState = (todo) ->
    todo = todo.toObject()

    checkCounter = Counter.findOne({todo: todo}).exec()
    When(checkCounter).then (checkCounter) ->
      if checkCounter
        todo.state = 1
      else
        todo.state = 0

      return todo

module.exports.ToDoUtils = ToDoUtils
