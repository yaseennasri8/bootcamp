const mongoose = require('mongoose');

const Bootcamp = new mongoose.Schema({
  bcCode: {
    type: String,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    unique: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  }
})

module.exports = mongoose.model('bootcamps', Bootcamp);