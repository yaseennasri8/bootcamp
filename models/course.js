const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  cCode: {
    type: String,
    required: true,
    unique: true
  },
  cName: {
    type: String,
    required: true,
  },
  creditHours: {
    type: Number,
    required: true
  },
  bootcamp: {
    type: mongoose.Schema.ObjectId,
    ref: 'bootcamps',
    required: true
  },
  author: {
    type: mongoose.Schema.ObjectId,
    ref: 'users',
    required: true
  }
})

module.exports = mongoose.model('courses', courseSchema);