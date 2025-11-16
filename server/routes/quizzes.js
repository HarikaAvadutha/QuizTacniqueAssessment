const express = require('express');
const router = express.Router();
const Quiz = require('../models/Quiz');
const Score = require('../models/Score');
const { authMiddleware } = require('../utils/auth');

// Get all quizzes (public)
router.get('/', async (req, res) => {
  try {
    const quizzes = await Quiz.find({});
    // Hide sensitive question data for public view
    const safeQuizzes = quizzes.map(quiz => ({
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      totalPoints: quiz.totalPoints,
      questions: quiz.questions // Include questions array for count
    }));
    res.json(safeQuizzes);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get quiz with questions (for taking quiz - public)
router.get('/:id', async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    // Return questions without answers revealed
    const safeQuiz = {
      _id: quiz._id,
      title: quiz.title,
      description: quiz.description,
      totalPoints: quiz.totalPoints,
      questions: quiz.questions.map(q => ({
        _id: q._id,
        type: q.type,
        question: q.question,
        options: q.type === 'multiplechoice' ? q.options : undefined,
        points: q.points
      }))
    };
    res.json(safeQuiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Create quiz (admin only)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title) return res.status(400).json({ error: 'Title required' });
    
    const quiz = new Quiz({ title, description, questions: [], totalPoints: 0 });
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Quiz title already exists' });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

// Add question to quiz (admin only)
router.post('/:id/questions', authMiddleware, async (req, res) => {
  try {
    const { type, question, options, correctAnswerIndex, correctAnswer, acceptableAnswers, points } = req.body;
    
    if (!question || !type) {
      return res.status(400).json({ error: 'Question and type required' });
    }

    // Validate based on type
    if (type === 'multiplechoice') {
      if (!options || options.length < 2 || correctAnswerIndex === undefined) {
        return res.status(400).json({ error: 'Multiple choice needs options and correct answer index' });
      }
    } else if (type === 'truefalse') {
      if (!correctAnswer || !['true', 'false'].includes(correctAnswer)) {
        return res.status(400).json({ error: 'True/False needs correct answer: true or false' });
      }
    } else if (type === 'shorttext' || type === 'essay') {
      if (!acceptableAnswers || acceptableAnswers.length === 0) {
        return res.status(400).json({ error: `${type} needs acceptable answers` });
      }
    }

    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    const questionData = {
      type,
      question,
      points: points || 1
    };

    if (type === 'multiplechoice') {
      questionData.options = options;
      questionData.correctAnswerIndex = correctAnswerIndex;
    } else if (type === 'truefalse') {
      questionData.correctAnswer = correctAnswer;
    } else if (type === 'shorttext' || type === 'essay') {
      questionData.acceptableAnswers = acceptableAnswers;
    }

    quiz.questions.push(questionData);
    quiz.totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    await quiz.save();
    res.status(201).json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete question (admin only)
router.delete('/:id/questions/:qId', authMiddleware, async (req, res) => {
  try {
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    quiz.questions.id(req.params.qId).deleteOne();
    quiz.totalPoints = quiz.questions.reduce((sum, q) => sum + q.points, 0);
    await quiz.save();
    res.json(quiz);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Submit quiz answers (public)
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers, username } = req.body; // array of {questionId, answer}
    const quiz = await Quiz.findById(req.params.id);
    if (!quiz) return res.status(404).json({ error: 'Quiz not found' });
    
    let score = 0;
    const details = [];

    quiz.questions.forEach((q, idx) => {
      const userAnswer = answers[idx];
      let isCorrect = false;

      if (q.type === 'multiplechoice') {
        isCorrect = userAnswer === q.correctAnswerIndex;
      } else if (q.type === 'truefalse') {
        isCorrect = userAnswer === q.correctAnswer;
      } else if (q.type === 'shorttext' || q.type === 'essay') {
        // Case-insensitive matching for text answers
        const normalizedUserAnswer = (userAnswer || '').trim().toLowerCase();
        isCorrect = q.acceptableAnswers.some(ans => ans.toLowerCase() === normalizedUserAnswer);
      }

      if (isCorrect) {
        score += q.points;
      }

      details.push({
        questionId: q._id,
        type: q.type,
        isCorrect,
        pointsEarned: isCorrect ? q.points : 0
      });
    });

    const percentage = Math.round((score / quiz.totalPoints) * 100) || 0;

    // Save score if username provided
    let saved = null;
    if (username && typeof username === 'string' && username.trim() !== '') {
      try {
        saved = await Score.create({
          quiz: quiz._id,
          username: username.trim(),
          score,
          total: quiz.totalPoints,
          percentage,
          details
        });
      } catch (e) {
        // Log and continue; don't fail the response because of score saving
        console.error('Failed to save score:', e);
      }
    }

    res.json({
      score,
      total: quiz.totalPoints,
      percentage,
      passed: percentage >= 60,
      message: percentage >= 60 ? 'Passed!' : 'Failed. Try again!',
      details,
      savedScoreId: saved ? saved._id : null,
      username: saved ? saved.username : (username || null)
    });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Get top scores for a quiz (public)
router.get('/:id/scores', async (req, res) => {
  try {
    const quizId = req.params.id;
    const scores = await Score.find({ quiz: quizId }).sort({ percentage: -1, score: -1, createdAt: 1 }).limit(20).select('-details');
    res.json(scores);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
