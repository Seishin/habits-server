global.Server = require('../../lib')
Server.register(require('inject-then'), function (err) {
  if (err) throw err;
})
