require ('./utils/spec_helper')
var chai = require('chai')
var should = chai.should()
var expect = chai.expect
var assert = chai.assert 

var When = require('when')
var Moment = require('moment')
var Models = require('../lib/models')
var User = Models.User
var UserStats = Models.UserStats
var DailyTask = Models.DailyTask
var Counter = Models.DailyTaskCounter

function createUser () {
  var user = new User()
  user.email = "test@test.co"
  user.password = "123"
  user.token = "random_token"
  
  var stats = new UserStats()
  stats.save()

  user.stats = stats
  user.save()

  return user
}

function createTask(userId, token) {
  var opts = {
    method: 'POST',
    url: '/daily-tasks/?userId=' + userId,
    payload: { text: 'Reading a book 1h' },
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function getTask (userId, taskId, token) {
  var opts = {
    method: 'GET',
    url: '/daily-tasks/' + taskId + '/?userId=' + userId,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function getAllTasks (userId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'GET',
    url: '/daily-tasks/all/?userId=' + userId + '&date=' + date,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function updateTask (userId, taskId, token, updatedText) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var data = { text: "Clean my room" }
  var opts = {
    method: 'PUT',
    url: '/daily-tasks/' + taskId + '/?userId=' + userId + '&date=' + date,
    payload: { text: updatedText },
    headers: { authorization: token } 
  }

  return Server.injectThen (opts)
}

function checkTask (userId, taskId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/daily-tasks/' + taskId + '/check/?userId=' + userId + '&date=' + date,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function uncheckTask (userId, taskId, token) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/daily-tasks/' + taskId + '/uncheck/?userId=' + userId + '&date=' + date,
    headers: { authorization: token }
  }

  return Server.injectThen (opts)
}

function deleteTask (userId, taskId, token) {
  var opts = {
    method: 'DELETE',
    url: '/daily-tasks/' + taskId + '/?userId=' + userId,
    headers: { authorization: token } 
  }

  return Server.injectThen (opts)
}

describe ('Daily Task', function () {
  user = null
  taskId = null
  
  beforeEach(function (done) {
    When(createUser()).then (function (result) {
      if (result != null)
        user = result
        done()   
    })
  })

  it ('Should create a daily task', function (done) {
    request = createTask(user._id, user.token)
    request.then (function (response) {
      payload = JSON.parse(response.payload)

      response.statusCode.should.equal(201)
      payload.should.have.property('text')
      payload.should.have.property('user')
      taskId = payload._id
      done()
    })
  })

  it ('Should not create a daily task (missing token)', function (done) {
    request = createTask(user._id, null)
    request.then (function (response) {
      response.statusCode.should.equal(401)
      done()
    })
  })

 it ('Should not create a daily task (wrong token)', function (done) {
    request = createTask(user._id, 'wrong_token')
    request.then (function (response) {
      response.statusCode.should.equal(401)
      done()
    })
  })
   
  describe ('Manipulations', function () {
    task = null

    beforeEach (function (done) {
      When(createTask(user._id, user.token)).then (function (result) {
        if (result != null)
          task = JSON.parse(result.payload)
          done()
      })
    })

    it ('Should get a daily task', function (done) {
      request = getTask(user._id, task._id, user.token)
      request.then (function (response) { 
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('text')
        payload.should.have.property('user')
        payload.should.have.property('state')
        done() 
      })
    })
    
    it ('Should not get a daily task (missing token)', function (done) {
      request = getTask(user._id, task._id, null)
      request.then (function (response) { 
        response.statusCode.should.equal(401)
        done()
      })
    })
    
    it ('Should not get a daily task (wrong token)', function (done) {
      request = getTask(user._id, task._id, 'wrong_tokne')
      request.then (function (response) { 
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should get all daily tasks', function (done) {
      request = getAllTasks(user._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('tasks')
        assert.isArray(payload.tasks)
        done()
      })
    })
    
    it ('Should not get all daily tasks (missing token)', function (done) {
      request = getAllTasks(user._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not get all daily tasks (wrong token)', function (done) {
      request = getAllTasks(user._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should check a task', function (done) {
      request = checkTask(user._id, task._id, user.token)
      request.then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('text')
        payload.should.have.property('user')
        payload.should.have.property('state')
        done()
      }) 
    })

    it ('Should not check a task (missing token)', function (done) {
      request = checkTask(user._id, task._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not check a task (wrong token)', function (done) {
      request = checkTask(user._id, task._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should uncheck a task', function (done) {
      request = checkTask(user._id, task._id, user.token)
      request.then (function (response) {
        request = uncheckTask(user._id, task._id, user.token)
        request.then (function (response) {
          payload = JSON.parse(response.payload)

          response.statusCode.should.equal(200)
          payload.should.have.property('text')
          payload.should.have.property('user')
          payload.should.have.property('state')
          done()
        }) 
      })
    })

    it ('Should not uncheck a task (missing token)', function (done) {
      request = uncheckTask(user._id, task._id, null)
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should not uncheck a task (wrong token)', function (done) {
      request = uncheckTask(user._id, task._id, 'wrong_token')
      request.then (function (response) {
        response.statusCode.should.equal(401)
        done()
      })
    })

    it ('Should check a task and update user\'s stats', function (done) {
      preUserStats = UserStats.findOne({_id: user.stats}).exec()

      request = checkTask(user._id, task._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        postUserStats = UserStats.findOne({_id: user.stats}).exec()

        When.join(preUserStats, postUserStats).then (function (stats) {
          assert.isAbove(stats[1].exp, stats[0].exp, 'Post exp > pre exp')
          assert.isAbove(stats[1].gold, stats[0].exp, 'Post gold > pre gold')
          assert.equal(stats[1].hp, stats[0].hp, 'Post hp == pre hp')
          stats[1].alive.should.equal(true)

          done()
        })
      })
    }) 

    it ('Should uncheck a specific task and update user\'s stats', function (done) {
      request = checkTask(user._id, task._id, user.token)
      request.then (function (response) {
        preUserStats = UserStats.findOne({_id: user.stats}).exec()
        request = uncheckTask(user._id, task._id, user.token)
        request.then (function (response) {
          response.statusCode.should.equal(200)

          postUserStats = UserStats.findOne({_id: user.stats}).exec()

          When.join(preUserStats, postUserStats).then (function (stats) {
            assert.isAbove(stats[0].exp, stats[1].exp, 'Pre exp > post  exp')
            assert.isAbove(stats[0].gold, stats[1].exp, 'Pre gold > post gold')
            assert.equal(stats[0].hp, stats[1].hp, 'Pre hp == post hp')
            stats[1].alive.should.equal(true)

            done()
          })
        })
      })
    })

    it ('Should update a task', function (done) {
      preUpdateText = task.text
      updatedText = 'Meditation 1h'

      request = updateTask(user._id, task._id, user.token, updatedText)
      request.then (function (response) {
        response.statusCode.should.equal(200)

        payload = JSON.parse(response.payload)
        payload.should.have.property('text')
        payload.should.have.property('state')
        payload.text.should.not.equal(preUpdateText)

        done()
      })
    })

    it ('Should delete a specific task', function (done) {
      request = deleteTask(user._id, task._id, user.token)
      request.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)
        payload.should.have.property('id')
        done()
      })
    })
  })

  after(function(done) {
    clearDB(function(err) {
      done()
    })
  })
})
