const express = require('express');
const router = express.Router();
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all chapters for a subject
router.get('/:subjectId', async (req, res) => {
  try {
    const chapters = await Chapter.find({ subject: req.params.subjectId })
      .sort('order');
    res.json(chapters);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single chapter
router.get('/:id', async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }
    res.json(chapter);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create chapter (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const chapter = new Chapter({
      subject: req.body.subject,
      title: req.body.title,
      order: req.body.order,
    });

    const newChapter = await chapter.save();
    res.status(201).json(newChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update chapter (admin only)
router.patch('/:id', [auth, admin], async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    if (req.body.title) chapter.title = req.body.title;
    if (req.body.order) chapter.order = req.body.order;

    const updatedChapter = await chapter.save();
    res.json(updatedChapter);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete chapter (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Delete all questions associated with this chapter
    await Question.deleteMany({ chapter: chapter._id });
    await chapter.remove();
    
    res.json({ message: 'Chapter and associated questions deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get chapter progress
router.get('/:id/progress', auth, async (req, res) => {
  try {
    const chapter = await Chapter.findById(req.params.id);
    if (!chapter) {
      return res.status(404).json({ message: 'Chapter not found' });
    }

    // Get all questions for this chapter
    const questions = await Question.find({ chapter: chapter._id });
    
    // Get user's test attempts for this chapter
    const testAttempts = await TestAttempt.find({
      user: req.user.id,
      chapter: chapter._id,
    });

    // Calculate progress
    const totalQuestions = questions.length;
    const completedQuestions = new Set(
      testAttempts
        .filter(attempt => attempt.score >= 70) // Consider 70% as passing
        .flatMap(attempt => attempt.questions.map(q => q.question.toString()))
    ).size;

    const progress = totalQuestions > 0
      ? Math.round((completedQuestions / totalQuestions) * 100)
      : 0;

    res.json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 