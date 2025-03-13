import mongoose from "mongoose";

const answerSchema = new mongoose.Schema({
  questionId: { type: mongoose.Schema.Types.ObjectId, required: true },
  questionText: String,
  selectedAnswer: String,
  correctAnswer: String,
  isCorrect: Boolean,
  pointsEarned: Number,
});

const resultSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
  userId: { type: String, required: true },
  answers: [answerSchema],
  score: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  maxScore: { type: Number, required: true },
  completedAt: { type: Date, default: Date.now },
});

export default mongoose.models.Result || mongoose.model("Result", resultSchema);
