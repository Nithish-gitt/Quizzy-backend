const mongoose = require('mongoose');

const candidateSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  candidateName: {
    type: String,
    required: true,
  },
  candidateEmail: {
    type: String,
    required: true,
    unique: true, // optional if emails should be unique
  },
  candidateUsername: {
    type: String,
    required: true,
    unique: true, // optional
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

const Candidate = mongoose.model('Candidate', candidateSchema);

module.exports = Candidate;
