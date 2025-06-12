const mongoose = require('mongoose');

const FileSetSchema = new mongoose.Schema({
  username: { type: String, required: true },
  Testname: { type: String, required: true },
  questionsText: { type: String, required: true },
  keyText: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FileSetPublic', FileSetSchema);
