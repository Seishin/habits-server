Mongoose = require 'mongoose'
Timestamps = require 'mongoose-timestamp'
FindOrCreate = require 'mongoose-findorcreate'
Schema = Mongoose.Schema

userSchema = new Schema
  email: {type: String, index:true, unique: true}
  password: String
  name: String
  profileAvatar: String
  token: String
  stats: {type: Schema.Types.ObjectId, ref: 'UserStats'}

habitSchema = new Schema
  text: String
  counters: [{type: Schema.Types.ObjectId, ref: 'HabitsCounter'}]
  user: {type: Schema.Types.ObjectId, ref: 'User'}

habitsCounterSchema = new Schema
  value: {type: Number, default: 0}
  habit: {type: Schema.Types.ObjectId, ref: 'Habit'}

dailyTaskSchema = new Schema
  text: String
  user: {type: Schema.Types.ObjectId, ref: 'User'}

dailyTaskCounterSchema = new Schema
  value: {type: Number, default: 0}
  task: {type: Schema.Types.ObjectId, ref: 'DailyTask'}

userStatsSchema = new Schema
  hp: {type: Number, default: 100}
  exp: {type: Number, default: 0}
  gold: {type: Number, default: 0}
  lvl: {type: Number, default: 1}
  alive: {type: Boolean, default: true}

userSchema.plugin Timestamps
userSchema.plugin FindOrCreate
habitSchema.plugin Timestamps
userStatsSchema.plugin Timestamps
userStatsSchema.plugin FindOrCreate
habitsCounterSchema.plugin Timestamps
habitsCounterSchema.plugin FindOrCreate
dailyTaskSchema.plugin Timestamps
dailyTaskSchema.plugin FindOrCreate
dailyTaskCounterSchema.plugin Timestamps
dailyTaskCounterSchema.plugin FindOrCreate

module.exports.User = Mongoose.model('User', userSchema)
module.exports.UserStats = Mongoose.model('UserStats', userStatsSchema)
module.exports.Habit = Mongoose.model('Habit', habitSchema)
module.exports.HabitsCounter = Mongoose.model('HabitsCounter', habitsCounterSchema)
module.exports.DailyTask = Mongoose.model('DailyTask', dailyTaskSchema)
module.exports.DailyTaskCounter = Mongoose.model('DailyTaskCounter', dailyTaskCounterSchema)
