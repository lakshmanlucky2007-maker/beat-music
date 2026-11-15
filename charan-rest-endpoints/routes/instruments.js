// routes/instruments.js - full CRUD for instruments (name and family)
const express = require('express');
const { instruments } = require('../db');

const router = express.Router();

// GET /instruments -> 200 + list
router.get('/', (req, res) => {
  res.status(200).json(instruments.getAll());
});

// GET /instruments/:id -> 200 or 404
router.get('/:id', (req, res) => {
  const instrument = instruments.getById(Number(req.params.id));
  if (!instrument) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  res.status(200).json(instrument);
});

// POST /instruments -> 201 + the new instrument
router.post('/', (req, res) => {
  const { name, family } = req.body;
  const created = instruments.create({ name, family });
  res.status(201).json(created);
});

// PUT /instruments/:id -> 200 or 404
router.put('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!instruments.getById(id)) return res.status(404).json({ error: `Instrument ${id} not found` });
  const { name, family } = req.body;
  res.status(200).json(instruments.update(id, { name, family }));
});

// DELETE /instruments/:id -> 204, 404, or 409 if it has loans
router.delete('/:id', (req, res) => {
  const id = Number(req.params.id);
  if (!instruments.getById(id)) return res.status(404).json({ error: `Instrument ${id} not found` });
  if (instruments.hasLoans(id)) {
    return res.status(409).json({ error: 'Instrument has loan history and cannot be deleted' });
  }
  instruments.remove(id);
  res.status(204).send();
});

module.exports = router;
