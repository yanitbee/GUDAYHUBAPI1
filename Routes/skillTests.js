const express = require('express');
const router = express.Router();
const SkillTest = require('../models/SkillTest');

// Get all skill tests
router.get('/getskilltests', async (req, res) => {
  try {
    const skillTests = await SkillTest.find();
    res.json(skillTests);
  } catch (err) {
    console.error('Error fetching skill tests:', err);
    res.status(500).json({ message: err.message });
  }
});

// Get a specific skill test by ID
router.get('/getskilltests/:id', async (req, res) => {
  try {
    const skillTest = await SkillTest.findById(req.params.id);
    if (!skillTest) {
      return res.status(404).json({ message: 'Skill test not found' });
    }
    res.json(skillTest);
  } catch (err) {
    console.error('Error fetching skill test:', err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
