const mongoose = require('mongoose');

const ScoreSchema = new mongoose.Schema({
  quiz: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  username: { type: String, required: true },
  score: { type: Number, required: true },
  total: { type: Number, required: true },
  percentage: { type: Number, required: true },
  details: { type: Array, default: [] },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Score', ScoreSchema);
