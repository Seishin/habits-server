(function() {
  var DailyTaskRoutes, HabitRoutes, ToDoRoutes, UserRoutes, UserStatsRoutes, routes;

  UserRoutes = require('./users/user_routes').routes;

  UserStatsRoutes = require('./user_stats/stats_routes').routes;

  HabitRoutes = require('./habits/habit_routes').routes;

  DailyTaskRoutes = require('./daily_task/daily_task_routes').routes;

  ToDoRoutes = require('./todo/todo_routes').routes;

  routes = [];

  routes = routes.concat(UserRoutes);

  routes = routes.concat(HabitRoutes);

  routes = routes.concat(UserStatsRoutes);

  routes = routes.concat(DailyTaskRoutes);

  routes = routes.concat(ToDoRoutes);

  module.exports.routes = routes;

}).call(this);
