// routes/musicians.js
const express = require('express');
const { data, nextId } = require('../data');

const router = express.Router();

// GET /musicians -> 200
router.get('/', (req, res) => {
  res.status(200).json(data.musicians);
});

// GET /musicians/:id -> 200 or 404
router.get('/:id', (req, res) => {
  const musician = data.musicians.find((m) => m.id === Number(req.params.id));
  if (!musician) return res.status(404).json({ error: `Musician ${req.params.id} not found` });
  res.status(200).json(musician);
});

// POST /musicians -> 201 Created
router.post('/', (req, res) => {
  const musician = { id: nextId(data.musicians), name: req.body.name, class_name: req.body.class_name || null };
  data.musicians.push(musician);
  res.status(201).json(musician);
});

module.exports = router;
