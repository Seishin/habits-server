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
  #habbits: [habitsSchema]
  #dailies: [dailiesSchema]
  #todos: [toDosSchema]

userSchema.plugin Timestamps
userSchema.plugin FindOrCreate

module.exports.User = Mongoose.model('User', userSchema)
