// routes/instruments.js - full CRUD + search by family + pagination (the twist)
const express = require('express');
const { instruments } = require('../db');
const { FAMILIES, validateInstrument, checkId } = require('../validation');

const router = express.Router();

// GET /instruments?family=strings&page=1&limit=5
router.get('/', (req, res) => {
  // ----- Twist: pages of results -----
  const page = req.query.page === undefined ? 1 : Number(req.query.page);
  const limit = req.query.limit === undefined ? 5 : Number(req.query.limit);

  if (!Number.isInteger(page) || page < 1) {
    return res.status(400).json({ error: 'page must be a whole number of 1 or more' });
  }
  if (!Number.isInteger(limit) || limit < 1) {
    return res.status(400).json({ error: 'limit must be a whole number of 1 or more' });
  }

  // ----- Search by query parameter -----
  let family;
  if (req.query.family !== undefined) {
    family = String(req.query.family).trim().toLowerCase();
    if (!FAMILIES.includes(family)) {
      return res.status(400).json({ error: `family must be one of: ${FAMILIES.join(', ')}` });
    }
  }

  const total = instruments.count({ family });
  const data = instruments.getAll({ family, limit, offset: (page - 1) * limit });
  res.status(200).json({ total, page, limit, data });
});

// GET /instruments/:id
router.get('/:id', checkId, (req, res) => {
  const instrument = instruments.getById(Number(req.params.id));
  if (!instrument) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  res.status(200).json(instrument);
});

// POST /instruments
router.post('/', (req, res) => {
  const errors = validateInstrument(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  const created = instruments.create({
    name: req.body.name.trim(),
    family: req.body.family.trim().toLowerCase(),
  });
  res.status(201).json(created);
});

// PUT /instruments/:id
router.put('/:id', checkId, (req, res) => {
  const id = Number(req.params.id);
  if (!instruments.getById(id)) return res.status(404).json({ error: `Instrument ${id} not found` });

  const errors = validateInstrument(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  const updated = instruments.update(id, {
    name: req.body.name.trim(),
    family: req.body.family.trim().toLowerCase(),
  });
  res.status(200).json(updated);
});

// DELETE /instruments/:id
router.delete('/:id', checkId, (req, res) => {
  const id = Number(req.params.id);
  if (!instruments.getById(id)) return res.status(404).json({ error: `Instrument ${id} not found` });
  if (instruments.hasLoans(id)) {
    return res.status(409).json({ error: 'Instrument has loan history and cannot be deleted' });
  }
  instruments.remove(id);
  res.status(204).send();
});

module.exports = router;
