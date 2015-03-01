UserRoutes = require('./users/user_routes').routes
HabitRoutes = require('./habits/habit_routes').routes
UserStatsRoutes = require('./user_stats/stats_routes').routes

routes = []
routes = routes.concat UserRoutes
routes = routes.concat HabitRoutes
routes = routes.concat UserStatsRoutes

module.exports.routes = routes
