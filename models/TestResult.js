const mongoose = require('mongoose');

const testResultSchema = new mongoose.Schema({
  username: { type: String, required: true },
  testname: String,
  score: Number,
  date: { type: Date, default: Date.now },
});

module.exports = mongoose.model('TestResult', testResultSchema);
