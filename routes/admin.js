const express = require('express');
const router = express.Router();
const multer = require('multer');
const csv = require('csv-parse');
const fs = require('fs');
const Subject = require('../models/Subject');
const Chapter = require('../models/Chapter');
const Question = require('../models/Question');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Configure multer for file upload
const upload = multer({
  dest: 'uploads/',
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'text/csv') {
      cb(null, true);
    } else {
      cb(new Error('Only CSV files are allowed'));
    }
  },
});

// Upload CSV content
router.post('/upload', [auth, admin, upload.single('file')], async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const results = [];
    const parser = fs
      .createReadStream(req.file.path)
      .pipe(csv.parse({ columns: true, skip_empty_lines: true }));

    for await (const record of parser) {
      results.push(record);
    }

    // Process records
    const stats = {
      subjects: new Set(),
      chapters: new Set(),
      questions: 0,
    };

    for (const record of results) {
      // Create or get subject
      let subject = await Subject.findOne({ name: record.Subject });
      if (!subject) {
        subject = await Subject.create({ name: record.Subject });
      }
      stats.subjects.add(subject._id);

      // Create or get chapter
      let chapter = await Chapter.findOne({
        subject: subject._id,
        title: record.Chapter,
      });
      if (!chapter) {
        chapter = await Chapter.create({
          subject: subject._id,
          title: record.Chapter,
        });
      }
      stats.chapters.add(chapter._id);

      // Create question
      await Question.create({
        subject: subject._id,
        chapter: chapter._id,
        pageNumber: parseInt(record.PageNumber),
        questionText: record.QuestionText,
        options: {
          A: record.OptionA,
          B: record.OptionB,
          C: record.OptionC,
          D: record.OptionD,
        },
        correctAnswer: record.CorrectAnswer,
        notes: record.NotesContent,
      });
      stats.questions++;
    }

    // Clean up uploaded file
    fs.unlinkSync(req.file.path);

    res.json({
      message: 'Content uploaded successfully',
      stats: {
        totalSubjects: stats.subjects.size,
        totalChapters: stats.chapters.size,
        totalQuestions: stats.questions,
      },
    });
  } catch (error) {
    // Clean up uploaded file if it exists
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    res.status(400).json({ message: error.message });
  }
});

// Get system statistics
router.get('/stats', [auth, admin], async (req, res) => {
  try {
    const [totalSubjects, totalChapters, totalQuestions, totalTestAttempts] =
      await Promise.all([
        Subject.countDocuments(),
        Chapter.countDocuments(),
        Question.countDocuments(),
        TestAttempt.countDocuments(),
      ]);

    res.json({
      totalSubjects,
      totalChapters,
      totalQuestions,
      totalTestAttempts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 