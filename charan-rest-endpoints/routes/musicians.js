// routes/musicians.js
const express = require('express');
const { musicians } = require('../db');

const router = express.Router();

// GET /musicians
router.get('/', (req, res) => {
  res.status(200).json(musicians.getAll());
});

// GET /musicians/:id
router.get('/:id', (req, res) => {
  const musician = musicians.getById(Number(req.params.id));
  if (!musician) return res.status(404).json({ error: `Musician ${req.params.id} not found` });
  res.status(200).json(musician);
});

// POST /musicians
router.post('/', (req, res) => {
  const { name, class_name } = req.body;
  res.status(201).json(musicians.create({ name, class_name }));
});

module.exports = router;
