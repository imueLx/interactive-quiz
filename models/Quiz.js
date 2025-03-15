const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: { type: String, required: true },
  options: { type: [String], required: true },
  answer: { type: String, required: true },
});

const quizSchema = new mongoose.Schema({
  ruleNumber: { type: Number, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  questions: { type: [questionSchema], required: true },
});

const Quiz = mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
