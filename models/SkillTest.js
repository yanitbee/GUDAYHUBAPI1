const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  correctOption: Number
});

const skillTestSchema = new mongoose.Schema({
  skill: String,
  questions: [questionSchema],
  duration: Number // in minutes
});

const SkillTest = mongoose.model('SkillTest', skillTestSchema);

module.exports = SkillTest;
