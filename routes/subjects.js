const express = require('express');
const router = express.Router();
const Subject = require('../models/Subject');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

// Get all subjects
router.get('/', async (req, res) => {
  try {
    const subjects = await Subject.find().sort('order');
    res.json(subjects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get single subject
router.get('/:id', async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }
    res.json(subject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create subject (admin only)
router.post('/', [auth, admin], async (req, res) => {
  try {
    const subject = new Subject({
      name: req.body.name,
      description: req.body.description,
      order: req.body.order,
    });

    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update subject (admin only)
router.patch('/:id', [auth, admin], async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    if (req.body.name) subject.name = req.body.name;
    if (req.body.description) subject.description = req.body.description;
    if (req.body.order) subject.order = req.body.order;

    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete subject (admin only)
router.delete('/:id', [auth, admin], async (req, res) => {
  try {
    const subject = await Subject.findById(req.params.id);
    if (!subject) {
      return res.status(404).json({ message: 'Subject not found' });
    }

    await subject.remove();
    res.json({ message: 'Subject deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router; 