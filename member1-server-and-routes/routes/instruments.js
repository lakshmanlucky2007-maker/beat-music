// routes/instruments.js
const express = require('express');
const { data, nextId } = require('../data');

const router = express.Router();

// GET /instruments -> 200
router.get('/', (req, res) => {
  res.status(200).json(data.instruments);
});

// GET /instruments/:id -> 200 or 404
router.get('/:id', (req, res) => {
  const instrument = data.instruments.find((i) => i.id === Number(req.params.id));
  if (!instrument) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  res.status(200).json(instrument);
});

// POST /instruments -> 201 Created
router.post('/', (req, res) => {
  const instrument = { id: nextId(data.instruments), name: req.body.name, family: req.body.family };
  data.instruments.push(instrument);
  res.status(201).json(instrument);
});

// PUT /instruments/:id -> 200 or 404
router.put('/:id', (req, res) => {
  const instrument = data.instruments.find((i) => i.id === Number(req.params.id));
  if (!instrument) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  instrument.name = req.body.name;
  instrument.family = req.body.family;
  res.status(200).json(instrument);
});

// DELETE /instruments/:id -> 204 No Content or 404
router.delete('/:id', (req, res) => {
  const index = data.instruments.findIndex((i) => i.id === Number(req.params.id));
  if (index === -1) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  data.instruments.splice(index, 1);
  res.status(204).send();
});

module.exports = router;
