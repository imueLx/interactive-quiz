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

// Fix: Prevent re-compilation of the model
const Quiz = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);

module.exports = Quiz;
