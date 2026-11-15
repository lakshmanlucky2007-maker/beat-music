// db.js - SQLite database: 3 related tables + all the queries
const Database = require('better-sqlite3');
const path = require('path');

// DB_FILE=":memory:" is used by the tests so they never touch the real file
const db = new Database(process.env.DB_FILE || path.join(__dirname, 'beatbox.db'));
db.pragma('foreign_keys = ON');

// ---------- Tables ----------
db.exec(`
  CREATE TABLE IF NOT EXISTS musicians (
    id         INTEGER PRIMARY KEY AUTOINCREMENT,
    name       TEXT NOT NULL,
    class_name TEXT
  );

  CREATE TABLE IF NOT EXISTS instruments (
    id     INTEGER PRIMARY KEY AUTOINCREMENT,
    name   TEXT NOT NULL,
    family TEXT NOT NULL
  );

  CREATE TABLE IF NOT EXISTS loans (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    musician_id   INTEGER NOT NULL REFERENCES musicians(id),
    instrument_id INTEGER NOT NULL REFERENCES instruments(id),
    loan_date     TEXT NOT NULL DEFAULT (date('now')),
    return_date   TEXT
  );
`);

// ---------- Sample data (only when the database is empty) ----------
const count = db.prepare('SELECT COUNT(*) AS n FROM instruments').get().n;
if (count === 0) {
  const addMusician = db.prepare('INSERT INTO musicians (name, class_name) VALUES (?, ?)');
  const addInstrument = db.prepare('INSERT INTO instruments (name, family) VALUES (?, ?)');
  const addLoan = db.prepare('INSERT INTO loans (musician_id, instrument_id, loan_date, return_date) VALUES (?, ?, ?, ?)');

  db.transaction(() => {
    addMusician.run('Asha Rao', '8A');
    addMusician.run('Ben Thomas', '9B');
    addMusician.run('Chen Li', '10C');

    addInstrument.run('Violin', 'strings');
    addInstrument.run('Cello', 'strings');
    addInstrument.run('Snare Drum', 'percussion');
    addInstrument.run('Tabla', 'percussion');
    addInstrument.run('Flute', 'woodwind');
    addInstrument.run('Trumpet', 'brass');
    addInstrument.run('Keyboard', 'keyboard');
    addInstrument.run('Guitar', 'strings');

    addLoan.run(1, 1, '2026-11-02', null);          // Asha has the Violin
    addLoan.run(2, 3, '2026-11-03', '2026-11-10');  // Ben returned the Snare Drum
    addLoan.run(3, 4, '2026-11-09', null);          // Chen has the Tabla
  })();
}

// ---------- Musician queries ----------
const musicians = {
  getAll: () => db.prepare('SELECT * FROM musicians ORDER BY id').all(),
  getById: (id) => db.prepare('SELECT * FROM musicians WHERE id = ?').get(id),
  create: ({ name, class_name }) => {
    const info = db.prepare('INSERT INTO musicians (name, class_name) VALUES (?, ?)').run(name, class_name ?? null);
    return musicians.getById(info.lastInsertRowid);
  },
};

// ---------- Instrument queries ----------
const instruments = {
  // family filter + pagination (limit / offset)
  getAll: ({ family, limit, offset } = {}) => {
    let sql = 'SELECT * FROM instruments';
    const params = [];
    if (family) { sql += ' WHERE family = ?'; params.push(family); }
    sql += ' ORDER BY id';
    if (limit !== undefined) { sql += ' LIMIT ? OFFSET ?'; params.push(limit, offset || 0); }
    return db.prepare(sql).all(...params);
  },
  count: ({ family } = {}) => {
    if (family) return db.prepare('SELECT COUNT(*) AS n FROM instruments WHERE family = ?').get(family).n;
    return db.prepare('SELECT COUNT(*) AS n FROM instruments').get().n;
  },
  getById: (id) => db.prepare('SELECT * FROM instruments WHERE id = ?').get(id),
  create: ({ name, family }) => {
    const info = db.prepare('INSERT INTO instruments (name, family) VALUES (?, ?)').run(name, family);
    return instruments.getById(info.lastInsertRowid);
  },
  update: (id, { name, family }) => {
    db.prepare('UPDATE instruments SET name = ?, family = ? WHERE id = ?').run(name, family, id);
    return instruments.getById(id);
  },
  remove: (id) => db.prepare('DELETE FROM instruments WHERE id = ?').run(id).changes,
  hasLoans: (id) => db.prepare('SELECT COUNT(*) AS n FROM loans WHERE instrument_id = ?').get(id).n > 0,
};

// ---------- Loan queries ----------
// The JOIN: each loan with the musician name and the instrument name
const LOAN_JOIN = `
  SELECT loans.id,
         musicians.name   AS musician_name,
         instruments.name AS instrument_name,
         loans.loan_date,
         loans.return_date
  FROM loans
  JOIN musicians   ON musicians.id   = loans.musician_id
  JOIN instruments ON instruments.id = loans.instrument_id
`;

const loans = {
  getAllWithNames: () => db.prepare(`${LOAN_JOIN} ORDER BY loans.id`).all(),
  getByIdWithNames: (id) => db.prepare(`${LOAN_JOIN} WHERE loans.id = ?`).get(id),
  isInstrumentOut: (instrumentId) =>
    !!db.prepare('SELECT id FROM loans WHERE instrument_id = ? AND return_date IS NULL').get(instrumentId),
  create: ({ musician_id, instrument_id }) => {
    const info = db.prepare('INSERT INTO loans (musician_id, instrument_id) VALUES (?, ?)').run(musician_id, instrument_id);
    return loans.getByIdWithNames(info.lastInsertRowid);
  },
  markReturned: (id) => {
    db.prepare("UPDATE loans SET return_date = date('now') WHERE id = ?").run(id);
    return loans.getByIdWithNames(id);
  },
  getRaw: (id) => db.prepare('SELECT * FROM loans WHERE id = ?').get(id),
};

module.exports = { db, musicians, instruments, loans };
