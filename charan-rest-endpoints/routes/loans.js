// routes/loans.js - the JOIN endpoint lives here
const express = require('express');
const { loans, musicians, instruments } = require('../db');

const router = express.Router();

// GET /loans -> JOIN: loans with the musician name and the instrument name
router.get('/', (req, res) => {
  res.status(200).json(loans.getAllWithNames());
});

// GET /loans/:id
router.get('/:id', (req, res) => {
  const loan = loans.getByIdWithNames(Number(req.params.id));
  if (!loan) return res.status(404).json({ error: `Loan ${req.params.id} not found` });
  res.status(200).json(loan);
});

// POST /loans { musician_id, instrument_id }
router.post('/', (req, res) => {
  const musician_id = Number(req.body.musician_id);
  const instrument_id = Number(req.body.instrument_id);

  if (!musicians.getById(musician_id)) return res.status(404).json({ error: `Musician ${musician_id} not found` });
  if (!instruments.getById(instrument_id)) return res.status(404).json({ error: `Instrument ${instrument_id} not found` });
  if (loans.isInstrumentOut(instrument_id)) {
    return res.status(409).json({ error: 'Instrument is already on loan and has not been returned' });
  }
  res.status(201).json(loans.create({ musician_id, instrument_id }));
});

// PATCH /loans/:id/return -> instrument is back in the cupboard
router.patch('/:id/return', (req, res) => {
  const id = Number(req.params.id);
  const loan = loans.getRaw(id);
  if (!loan) return res.status(404).json({ error: `Loan ${id} not found` });
  if (loan.return_date) return res.status(409).json({ error: 'Loan was already returned' });
  res.status(200).json(loans.markReturned(id));
});

module.exports = router;
