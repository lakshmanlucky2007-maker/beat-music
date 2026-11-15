// server.js - Express setup, routes and status codes
// Data is kept in memory here (arrays). The SQLite database comes in 2-database.
const express = require('express');

const musiciansRouter = require('./routes/musicians');
const instrumentsRouter = require('./routes/instruments');
const loansRouter = require('./routes/loans');

const app = express();
app.use(express.json()); // read JSON bodies

// Home route
app.get('/', (req, res) => {
  res.status(200).json({
    message: 'BeatBox Music Room API',
    endpoints: ['/musicians', '/instruments', '/loans'],
  });
});

// Mount the three route groups
app.use('/musicians', musiciansRouter);
app.use('/instruments', instrumentsRouter);
app.use('/loans', loansRouter);

// 404 for any route we don't have
app.use((req, res) => {
  res.status(404).json({ error: `Route ${req.method} ${req.originalUrl} not found` });
});

// 400 for broken JSON, 500 for anything unexpected
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'Request body is not valid JSON' });
  }
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`BeatBox API running on http://localhost:${PORT}`));
