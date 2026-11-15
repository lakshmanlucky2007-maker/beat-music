// data.js - temporary in-memory data (replaced by SQLite in 2-database)
const data = {
  musicians: [
    { id: 1, name: 'Asha Rao', class_name: '8A' },
    { id: 2, name: 'Ben Thomas', class_name: '9B' },
  ],
  instruments: [
    { id: 1, name: 'Violin', family: 'strings' },
    { id: 2, name: 'Snare Drum', family: 'percussion' },
    { id: 3, name: 'Flute', family: 'woodwind' },
  ],
  loans: [
    { id: 1, musician_id: 1, instrument_id: 1, loan_date: '2026-11-02', return_date: null },
  ],
};

// simple id counter per list
function nextId(list) {
  return list.length ? Math.max(...list.map((x) => x.id)) + 1 : 1;
}

module.exports = { data, nextId };
