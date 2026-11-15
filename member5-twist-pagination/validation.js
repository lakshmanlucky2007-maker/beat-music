// validation.js - input checks with clear error messages
const FAMILIES = ['strings', 'percussion', 'woodwind', 'brass', 'keyboard'];

function isPositiveInt(value) {
  return Number.isInteger(Number(value)) && Number(value) > 0;
}

// Used by POST and PUT /instruments
function validateInstrument(body) {
  const errors = [];
  if (!body || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required and must be a non-empty text');
  } else if (body.name.trim().length > 50) {
    errors.push('name must be 50 characters or less');
  }
  if (!body || typeof body.family !== 'string' || body.family.trim() === '') {
    errors.push(`family is required (one of: ${FAMILIES.join(', ')})`);
  } else if (!FAMILIES.includes(body.family.trim().toLowerCase())) {
    errors.push(`family must be one of: ${FAMILIES.join(', ')}`);
  }
  return errors;
}

function validateMusician(body) {
  const errors = [];
  if (!body || typeof body.name !== 'string' || body.name.trim() === '') {
    errors.push('name is required and must be a non-empty text');
  }
  if (body && body.class_name !== undefined && typeof body.class_name !== 'string') {
    errors.push('class_name must be text');
  }
  return errors;
}

function validateLoan(body) {
  const errors = [];
  if (!body || !isPositiveInt(body.musician_id)) errors.push('musician_id is required and must be a positive whole number');
  if (!body || !isPositiveInt(body.instrument_id)) errors.push('instrument_id is required and must be a positive whole number');
  return errors;
}

// Middleware: stop bad ids like /instruments/abc before they reach the database
function checkId(req, res, next) {
  if (!isPositiveInt(req.params.id)) {
    return res.status(400).json({ error: 'id must be a positive whole number' });
  }
  next();
}

module.exports = { FAMILIES, isPositiveInt, validateInstrument, validateMusician, validateLoan, checkId };
