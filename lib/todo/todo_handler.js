(function() {
  var Counter, Models, Moment, ToDo, ToDoHandler, ToDoUtils, User, UserStatsUtils, When;

  Models = require('../models');

  User = Models.User;

  ToDo = Models.ToDo;

  Counter = Models.ToDoCounter;

  When = require('when');

  Moment = require('moment');

  ToDoUtils = require('../todo/utils').ToDoUtils;

  UserStatsUtils = require('../user_stats/utils').UserStatsUtils;

  ToDoHandler = (function() {
    function ToDoHandler() {}

    ToDoHandler.createToDo = function(request, reply) {
      var todo;
      todo = new ToDo();
      todo.text = request.payload.text;
      todo.user = request.query.userId;
      todo.save();
      return When(todo).then(function(todo) {
        return reply(ToDoUtils.getState(todo)).code(201);
      });
    };

    ToDoHandler.getToDo = function(request, reply) {
      var todo;
      todo = ToDo.findOne({
        _id: request.params.todoId,
        user: request.query.userId
      }).exec();
      return When(todo).then(function(todo) {
        return reply(ToDoUtils.getState(todo)).code(200);
      });
    };

    ToDoHandler.getAllToDos = function(request, reply) {
      var todos;
      todos = ToDo.find({
        user: request.query.userId
      }).exec();
      return When(todos).then(function(todos) {
        var result, todo, _i, _len;
        result = [];
        for (_i = 0, _len = todos.length; _i < _len; _i++) {
          todo = todos[_i];
          result.push(ToDoUtils.getState(todo, request.query.date));
        }
        return When.all(result).then(function(result) {
          return reply({
            todos: result
          }).code(200);
        });
      });
    };

    ToDoHandler.checkToDo = function(request, reply) {
      var todo;
      todo = ToDo.findOne({
        _id: request.params.todoId,
        user: request.query.userId
      }).exec();
      return When(todo).then(function(todo) {
        var c;
        c = Counter();
        c.todo = todo;
        c.save();
        return UserStatsUtils.updateStats(todo, true, function(done) {
          return reply(ToDoUtils.getState(todo, request.query.date)).code(200);
        });
      });
    };

    ToDoHandler.uncheckToDo = function(request, reply) {
      var todo;
      todo = ToDo.findOne({
        _id: request.params.todoId,
        user: request.query.userId
      }).exec();
      return When(todo).then(function(todo) {
        return Counter.remove({
          todo: todo,
          createdAt: {
            $gte: request.query.date
          }
        }, function(err, result) {
          if (!err) {
            return UserStatsUtils.updateStats(todo, false, function(done) {
              return reply(ToDoUtils.getState(todo, request.query.date)).code(200);
            });
          } else {
            return reply({
              message: err
            }).code(409);
          }
        });
      });
    };

    ToDoHandler.updateToDo = function(request, reply) {
      var todo;
      todo = ToDo.findOne({
        _id: request.params.todoId,
        user: request.query.userId
      }).exec();
      return When(todo).then(function(todo) {
        todo.text = request.payload.text;
        todo.save();
        return reply(ToDoUtils.getState(todo, request.query.date)).code(200);
      });
    };

    ToDoHandler.deleteToDo = function(request, reply) {
      ToDo.remove({
        _id: request.params.todoId,
        user: request.query.userId
      }, function(err, result) {
        if (!err) {
          return reply({
            id: request.params.todoId
          }).code(200);
        }
      }).exec();
      return Counter.remove({
        task: request.params.todoId
      }).exec();
    };

    return ToDoHandler;

  })();

  module.exports.ToDoHandler = ToDoHandler;

}).call(this);
