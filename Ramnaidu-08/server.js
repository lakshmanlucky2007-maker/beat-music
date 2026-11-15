// server.js - small server that proves the database and queries work
// (Full CRUD comes in 3-rest-endpoints. This folder is about db.js.)
const express = require('express');
const { db, musicians, instruments, loans } = require('./db');

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).json({ message: 'BeatBox Music Room - database part', tables: ['musicians', 'instruments', 'loans'] });
});

// Show every table's columns (handy for the demo)
app.get('/schema', (req, res) => {
  const tables = ['musicians', 'instruments', 'loans'];
  const schema = {};
  tables.forEach((t) => { schema[t] = db.prepare(`PRAGMA table_info(${t})`).all().map((c) => `${c.name} ${c.type}`); });
  res.status(200).json(schema);
});

app.get('/musicians', (req, res) => res.status(200).json(musicians.getAll()));
app.get('/instruments', (req, res) => res.status(200).json(instruments.getAll()));
app.get('/loans', (req, res) => res.status(200).json(db.prepare('SELECT * FROM loans').all()));

app.get('/musicians/:id', (req, res) => {
  const row = musicians.getById(Number(req.params.id));
  if (!row) return res.status(404).json({ error: `Musician ${req.params.id} not found` });
  res.status(200).json(row);
});

app.get('/instruments/:id', (req, res) => {
  const row = instruments.getById(Number(req.params.id));
  if (!row) return res.status(404).json({ error: `Instrument ${req.params.id} not found` });
  res.status(200).json(row);
});

app.use((req, res) => res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` }));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BeatBox API (database part) on http://localhost:${PORT}`));
