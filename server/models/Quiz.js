const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['truefalse', 'multiplechoice', 'shorttext', 'essay'],
    default: 'multiplechoice'
  },
  question: { type: String, required: true },
  
  // For True/False
  correctAnswer: { type: String }, // 'true' or 'false'
  
  // For Multiple Choice
  options: [{ type: String }],
  correctAnswerIndex: { type: Number }, // index of correct option
  
  // For Text (Short & Essay) - can have multiple acceptable answers
  acceptableAnswers: [{ type: String }], // case-insensitive matching
  
  // Points for this question
  points: { type: Number, default: 1 },
  
  createdAt: { type: Date, default: Date.now }
});

const QuizSchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  description: { type: String },
  questions: [QuestionSchema],
  totalPoints: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Quiz', QuizSchema);
