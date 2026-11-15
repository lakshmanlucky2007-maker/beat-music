# Member 2 – Database

**Goal:** the 3 SQLite tables and the queries.

## Run
```bash
npm install
npm start      # http://localhost:3000
```
`beatbox.db` is created on first run with sample data. Delete it to reset.

## Tables (`db.js`)
```
musicians   (id, name, class_name)
instruments (id, name, family)
loans       (id, musician_id -> musicians.id,
                 instrument_id -> instruments.id,
                 loan_date, return_date)
```
- `loans` links the other two tables with **foreign keys** (`PRAGMA foreign_keys = ON`).
- `return_date` is `NULL` while the instrument is still out – this fixes "instruments do not come back".

## Queries exported from `db.js`
| Object | Functions |
|---|---|
| `musicians` | `getAll`, `getById`, `create` |
| `instruments` | `getAll`, `getById`, `create`, `update`, `remove`, `hasLoans` |
| `loans` | `getAllWithNames` (JOIN), `getByIdWithNames`, `create`, `markReturned`, `isInstrumentOut`, `getRaw` |

All queries use **prepared statements with `?`** so user input can't break the SQL (no SQL injection).

## Try it
| Request | Shows |
|---|---|
| `GET /schema` | columns of all 3 tables |
| `GET /musicians`, `/instruments`, `/loans` | rows from each table |
| `GET /instruments/1` | one row (404 if missing) |

## Likely demo questions
- *Why 3 tables, not one?* A musician can borrow many instruments over time; the loans table connects them without repeating names.
- *What is a foreign key?* `loans.musician_id` must match a real `musicians.id`.
- *Why better-sqlite3?* Simple synchronous code, fast, no callbacks.

## My share of part 6 – Postman and README
- **Postman:** `member2-database.postman_collection.json` – 7 requests: schema shows 3 tables, sample data in each table, get one, 404.
  Import it in Postman, delete `beatbox.db`, `npm start`, then **Run collection**. All checks pass.
- **README:** I wrote the **Database** table of the final README (in `member5-twist-pagination/README.md`).
