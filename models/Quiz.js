const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
  question: String,
  options: [String], // Multiple choices
  correctAnswer: String,
  points: Number, // Points per question
});

const quizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [questionSchema],
});

module.exports = mongoose.models.Quiz || mongoose.model("Quiz", quizSchema);
