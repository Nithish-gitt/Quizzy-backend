const mongoose = require('mongoose');

const FileSetSchema = new mongoose.Schema({
  username: { type: String, required: true },
  Testname: { type: String, required: true },
  questionsText: { type: String, required: true },
  keyText: { type: String, required: true },
  // testVisibility: {
  //   type: String,
  //   enum: ['public', 'private'],
  //   default: 'private',
  // },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FileSet', FileSetSchema);
