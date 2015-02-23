UserRoutes = require('./routes/user_routes').routes
HabitRoutes = require('./routes/habit_routes').routes

routes = []
routes = routes.concat UserRoutes
routes = routes.concat HabitRoutes

module.exports.routes = routes
