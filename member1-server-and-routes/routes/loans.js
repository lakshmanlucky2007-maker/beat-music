// routes/loans.js
const express = require('express');
const { data, nextId } = require('../data');

const router = express.Router();

// GET /loans -> 200
router.get('/', (req, res) => {
  res.status(200).json(data.loans);
});

// GET /loans/:id -> 200 or 404
router.get('/:id', (req, res) => {
  const loan = data.loans.find((l) => l.id === Number(req.params.id));
  if (!loan) return res.status(404).json({ error: `Loan ${req.params.id} not found` });
  res.status(200).json(loan);
});

// POST /loans -> 201 Created
router.post('/', (req, res) => {
  const loan = {
    id: nextId(data.loans),
    musician_id: Number(req.body.musician_id),
    instrument_id: Number(req.body.instrument_id),
    loan_date: new Date().toISOString().slice(0, 10),
    return_date: null,
  };
  data.loans.push(loan);
  res.status(201).json(loan);
});

module.exports = router;
