(function() {
  var Counter, Models, Moment, ToDoUtils, When;

  Moment = require('moment');

  When = require('when');

  Models = require('../models');

  Counter = Models.ToDoCounter;

  ToDoUtils = (function() {
    function ToDoUtils() {}

    ToDoUtils.getState = function(todo) {
      var checkCounter;
      todo = todo.toObject();
      checkCounter = Counter.findOne({
        todo: todo
      }).exec();
      return When(checkCounter).then(function(checkCounter) {
        if (checkCounter) {
          todo.state = 1;
        } else {
          todo.state = 0;
        }
        return todo;
      });
    };

    return ToDoUtils;

  })();

  module.exports.ToDoUtils = ToDoUtils;

}).call(this);
