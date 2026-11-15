// routes/loans.js - includes the JOIN endpoint
const express = require('express');
const { loans, musicians, instruments } = require('../db');
const { validateLoan, checkId } = require('../validation');

const router = express.Router();

// GET /loans  -> JOIN: every loan with the musician name and instrument name
router.get('/', (req, res) => {
  res.status(200).json(loans.getAllWithNames());
});

// GET /loans/:id
router.get('/:id', checkId, (req, res) => {
  const loan = loans.getByIdWithNames(Number(req.params.id));
  if (!loan) return res.status(404).json({ error: `Loan ${req.params.id} not found` });
  res.status(200).json(loan);
});

// POST /loans  { musician_id, instrument_id }
router.post('/', (req, res) => {
  const errors = validateLoan(req.body);
  if (errors.length) return res.status(400).json({ error: errors.join('; ') });

  const musician_id = Number(req.body.musician_id);
  const instrument_id = Number(req.body.instrument_id);

  if (!musicians.getById(musician_id)) return res.status(404).json({ error: `Musician ${musician_id} not found` });
  if (!instruments.getById(instrument_id)) return res.status(404).json({ error: `Instrument ${instrument_id} not found` });
  if (loans.isInstrumentOut(instrument_id)) {
    return res.status(409).json({ error: 'Instrument is already on loan and has not been returned' });
  }

  res.status(201).json(loans.create({ musician_id, instrument_id }));
});

// PATCH /loans/:id/return  -> the instrument comes back to the cupboard
router.patch('/:id/return', checkId, (req, res) => {
  const id = Number(req.params.id);
  const loan = loans.getRaw(id);
  if (!loan) return res.status(404).json({ error: `Loan ${id} not found` });
  if (loan.return_date) return res.status(409).json({ error: 'Loan was already returned' });
  res.status(200).json(loans.markReturned(id));
});

module.exports = router;
