const express = require('express');
const router = express.Router();
const TestAttempt = require('../models/TestAttempt');
const Question = require('../models/Question');
const auth = require('../middleware/auth');

// Start a new test
router.post('/start', auth, async (req, res) => {
  try {
    const { chapterId, pageNumber } = req.body;

    // Get questions for the specified page
    const questions = await Question.find({
      chapter: chapterId,
      pageNumber: pageNumber,
    });

    if (!questions.length) {
      return res.status(404).json({ message: 'No questions found for this page' });
    }

    // Create new test attempt
    const testAttempt = new TestAttempt({
      user: req.user.id,
      subject: questions[0].subject,
      chapter: chapterId,
      pageNumber: pageNumber,
      questions: questions.map(q => ({
        question: q._id,
        selectedAnswer: null,
        isCorrect: null,
      })),
      totalQuestions: questions.length,
      timeLimit: Math.ceil(questions.length / 2), // 2 minutes per question
    });

    const newTestAttempt = await testAttempt.save();
    res.status(201).json(newTestAttempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Submit test answers
router.post('/:testId/submit', auth, async (req, res) => {
  try {
    const { answers } = req.body;
    const testAttempt = await TestAttempt.findById(req.params.testId);

    if (!testAttempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }

    if (testAttempt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    // Get all questions for this test
    const questionIds = testAttempt.questions.map(q => q.question);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const questionsMap = new Map(questions.map(q => [q._id.toString(), q]));

    // Update answers and calculate score
    let correctAnswers = 0;
    let attemptedQuestions = 0;

    testAttempt.questions = testAttempt.questions.map(q => {
      const selectedAnswer = answers[q.question.toString()];
      const question = questionsMap.get(q.question.toString());
      
      if (selectedAnswer) {
        attemptedQuestions++;
        const isCorrect = selectedAnswer === question.correctAnswer;
        if (isCorrect) correctAnswers++;
        return {
          ...q.toObject(),
          selectedAnswer,
          isCorrect,
        };
      }
      return q;
    });

    // Update test attempt
    testAttempt.attemptedQuestions = attemptedQuestions;
    testAttempt.correctAnswers = correctAnswers;
    testAttempt.score = (correctAnswers / testAttempt.totalQuestions) * 100;
    testAttempt.completedAt = new Date();

    const updatedTestAttempt = await testAttempt.save();
    res.json(updatedTestAttempt);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get test results
router.get('/results/:testId', auth, async (req, res) => {
  try {
    const testAttempt = await TestAttempt.findById(req.params.testId)
      .populate('questions.question')
      .populate('subject', 'name')
      .populate('chapter', 'title');

    if (!testAttempt) {
      return res.status(404).json({ message: 'Test attempt not found' });
    }

    if (testAttempt.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(testAttempt);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's test history
router.get('/history', auth, async (req, res) => {
  try {
    const testAttempts = await TestAttempt.find({ user: req.user.id })
      .populate('subject', 'name')
      .populate('chapter', 'title')
      .sort('-completedAt')
      .limit(10);

    res.json(testAttempts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 