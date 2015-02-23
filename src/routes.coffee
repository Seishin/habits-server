UserRoutes = require('./routes/user_routes').routes

routes = []
routes = routes.concat UserRoutes

module.exports.routes = routes
