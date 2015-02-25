var dbURI = 'mongodb://localhost/habits'
global.clearDB = require('mocha-mongoose')(dbURI)

afterEach(function(done) {
  clearDB(function(err) {
    done()
  })
})
