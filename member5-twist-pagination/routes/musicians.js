// routes/musicians.js
const express = require('express');
const { musicians } = require('../db');
const { validateMusician, checkId } = require('../validation');

const router = express.Router();

// GET /musicians
router.get('/', (req, res) => {
  res.status(200).json(musicians.getAll());
});

// GET /musicians/:id
router.get('/:id', checkId, (req, res) => {
  const musician = musicians.getById(Number(req.params.id));
  if (!musician) return res.status(404).json({ error: `Musician ${req.params.id} not found` });
  res.status(200).json(musician);
});

// POST /musicians
router.post('/', (req, res) => {
  const errors = validateMusician(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  const created = musicians.create({
    name: req.body.name.trim(),
    class_name: req.body.class_name ? req.body.class_name.trim() : null,
  });
  res.status(201).json(created);
});

module.exports = router;
