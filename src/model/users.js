'use strict'

const mongoose = require('mongoose')
require('mongoose-long')(mongoose)

const userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: [true, 'First Name is required']
  },
  last_name: {
    type: String,
    required: [true, 'Last Name is required']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    unique: true
  },
  phone_number: {
    type: String,
    required: [true, 'Phone number is required']
  },
  profile_image: {
    type: String,
    required: [true, 'Profile image is required']
  },
  is_deleted: {
    type: Boolean,
    default: false,
    select: false
  },
  created_by: {
    type: String,
    default: 'SYSTEM'
  },
  updated_by: {
    type: String,
    default: 'SYSTEM'
  }
}, {
  timestamps: {
    createdAt: 'created_on',
    updatedAt: 'updated_on'
  },
  collection: 'users'
})

userSchema.pre(/^find/, function (next) {
  // this points to the current query
  this.find({ is_deleted: { $eq: false } })
  next()
})

module.exports = mongoose.model('users', userSchema)
