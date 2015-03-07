require ('./spec_helper')
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

function createTask(userId) {
  var opts = {
    method: 'POST',
    url: '/daily-task/?userId=' + userId,
    payload: { text: 'Reading a book 1h' },
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function getTask (userId, taskId) {
  var opts = {
    method: 'GET',
    url: '/daily-task/' + taskId + '/?userId=' + userId,
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function getAllTasks (userId) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'GET',
    url: '/daily-task/all/?userId=' + userId + '&date=' + date,
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function updateTask (userId, taskId) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var data = { text: "Clean my room" }
  var opts = {
    method: 'PUT',
    url: '/daily-task/' + taskId + '/?userId=' + userId + '&date=' + date,
    payload: data,
    headers: { authorization: 'random_token' } 
  }

  return Server.injectThen (opts)
}

function checkTask (userId, taskId) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/daily-task/' + taskId + '/check/?userId=' + userId + '&date=' + date,
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function uncheckTask (userId, taskId) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/daily-task/' + taskId + '/uncheck/?userId=' + userId + '&date=' + date,
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function deleteTask (userId, taskId) {
  var opts = {
    method: 'DELETE',
    url: '/daily-task/' + taskId + '/?userId=' + userId,
    headers: { authorization: 'random_token' } 
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
    request = createTask(user._id)
    When(request).then (function (response) {
      payload = JSON.parse(response.payload)

      response.statusCode.should.equal(201)
      payload.should.have.property("text")
      payload.should.have.property("user")
      taskId = payload._id
      done()
    })
  })
    
  describe ('Manipulations', function () {
    task = null

    beforeEach (function (done) {
      request = createTask(user._id)
      When(createTask(user._id)).then (function (result) {
        if (result != null)
          task = JSON.parse(result.payload)
          done()
      })
    })

    it ('Should get a specific daily task', function (done) {
      request = getTask(user._id, task._id)
      When(request).then (function (response) { 
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property("text")
        payload.should.have.property("user")
        payload.should.have.property("state")
        done() 
      })
    })

    it ('Should get all daily tasks', function (done) {
      request = getAllTasks(user._id, task._id)
      When(request).then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('tasks')
        assert.isArray(payload.tasks)
        done()
      })
    })

    it ('Should check a specific task', function (done) {
      request = checkTask(user._id, task._id)
      When(request).then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property("text")
        payload.should.have.property("user")
        payload.should.have.property("state")
        done()
      }) 
    })

    it ('Should uncheck a specific task', function (done) {
      request = checkTask(user._id, task._id)
      When(request).then (function (response) {
        request = uncheckTask(user._id, task._id)
        When(request).then (function (response) {
          payload = JSON.parse(response.payload)

          response.statusCode.should.equal(200)
          payload.should.have.property("text")
          payload.should.have.property("user")
          payload.should.have.property("state")
          done()
        }) 
      })
    })


    it ('Should check a specific task and update user\'s stats', function (done) {
      preUserStats = UserStats.findOne({_id: user.stats}).exec()
      request = checkTask(user._id, task._id)
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
      request = checkTask(user._id, task._id)
      request.then (function (response) {
        preUserStats = UserStats.findOne({_id: user.stats}).exec()
        request = uncheckTask(user._id, task._id)
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

    it ('Should update a specific task', function (done) {
      preUpdateText = task.text
      request = updateTask(user._id, task._id)
      request.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)
        payload.text.should.not.equal(preUpdateText)
        done()
      })
    })

    it ('Should delete a specific task', function (done) {
      request = deleteTask(user._id, task._id)
      request.then (function (response) {
        response.statusCode.should.equal(200)
        payload = JSON.parse(response.payload)
        payload.should.have.property("id")
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
