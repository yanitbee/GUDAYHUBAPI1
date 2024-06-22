// routes/skillTests.js
const express = require('express');
const router = express.Router();
const SkillTest = require('../models/SkillTest');

// Get all skill tests
router.get('/', async (req, res) => {
  try {
    const skillTests = await SkillTest.find();
    res.json(skillTests);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get a specific skill test
router.get('/:id', async (req, res) => {
  try {
    const skillTest = await SkillTest.findById(req.params.id);
    res.json(skillTest);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Submit test results
router.post('/:id/submit', async (req, res) => {
  try {
    const { answers } = req.body;
    const skillTest = await SkillTest.findById(req.params.id);
    let score = 0;
    skillTest.questions.forEach((question, index) => {
      if (question.correctOption === answers[index]) {
        score++;
      }
    });
    res.json({ score });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
