UserRoutes = require('./users/user_routes').routes
HabitRoutes = require('./habits/habit_routes').routes

routes = []
routes = routes.concat UserRoutes
routes = routes.concat HabitRoutes

module.exports.routes = routes
