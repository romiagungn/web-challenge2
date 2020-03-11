const mongoose = require('mongoose');

const dataSchema = mongoose.Schema({
  string: {
    type: String,
  },
  integer: {
    type: Number,
  },
  float: {
    type: Number,
  },
  date: {
    type: String
  },
  boolean: {
    type: String
  }
})

module.exports = mongoose.model('bread', dataSchema);