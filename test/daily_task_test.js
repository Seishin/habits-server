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
  var opts = {
    method: 'PUT',
    url: '/daily-task/' + taskId + '/?userId=' + userId,
    headers: { authorization: 'random_token' } 
  }

  return Server.injectThen (opts)
}

function checkTask (userId, taskId) {
  var date = Moment(new Date()).format('YYYY-MM-DD')
  var opts = {
    method: 'POST',
    url: '/daily-task/' + taskId + '/?userId=' + userId + '&date=' + date,
    headers: { authorization: 'random_token' }
  }

  return Server.injectThen (opts)
}

function deleteTask (userId, taskId) {
  var opts = {
    method: 'DELETE',
    url: '/daily-task/' + dailyTask + '/?userId=' + userId,
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
    taskId = null

    beforeEach (function (done) {
      request = createTask(user._id)
      When(createTask(user._id)).then (function (result) {
        if (result != null)
          payload = JSON.parse(result.payload)
          taskId = payload._id
          done()
      })
    })

    it ('Should get a specific daily task', function (done) {
      request = getTask(user._id, taskId)
      When(request).then (function (response) { 
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property("text")
        payload.should.have.property("user")
        done() 
      })
    })

    it ('Should get all daily tasks', function (done) {
      request = getAllTasks(user._id, taskId)
      When(request).then (function (response) {
        payload = JSON.parse(response.payload)

        response.statusCode.should.equal(200)
        payload.should.have.property('tasks')
        assert.isArray(payload.tasks)
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
