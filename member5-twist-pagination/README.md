# BeatBox Music Room – Instrument Loans API

> "Instruments are borrowed from a cupboard with a paper list. Strings and drums go home with students and do not come back. Please build us a system that fixes this."

A REST API that replaces the paper list. It tracks **musicians**, **instruments** and **loans**, stops an instrument being lent twice, and records when it comes back.

**Tech:** Node.js, Express, SQLite (better-sqlite3)
**Theme:** 9 of 30 – Instrument loans · **Twist:** Pages of results

---

## How to run

You need **Node.js 18 or newer**.

```bash
npm install
npm start
```

The server runs on **http://localhost:3000**.
The database file `beatbox.db` is created on first start, with sample data (3 musicians, 8 instruments, 3 loans).
To start fresh, stop the server, delete `beatbox.db`, and start again.

Run the twist tests (Member 5) from the terminal:

```bash
npm test
```

---

## Project structure

```
server.js              Express setup, mounts the routes, 404 + error handler
db.js                  SQLite: creates the 3 tables, sample data, all queries
validation.js          Input checks and clear error messages
routes/musicians.js    /musicians endpoints
routes/instruments.js  /instruments endpoints (CRUD, search, pagination)
routes/loans.js        /loans endpoints (the JOIN endpoint)
test/twist.test.js     The 3 twist tests (npm test)
BeatBox.postman_collection.json   Postman collection with tests
```

## Database

| Table | Columns |
|---|---|
| musicians | id, name, class_name |
| instruments | id, name, family |
| loans | id, musician_id → musicians.id, instrument_id → instruments.id, loan_date, return_date |

`return_date` is empty while the instrument is still out.
Families: `strings`, `percussion`, `woodwind`, `brass`, `keyboard`.

---

## Endpoints

### Instruments (full CRUD)

| Method | URL | Success | Errors |
|---|---|---|---|
| GET | `/instruments` | 200 | 400 bad page/limit/family |
| GET | `/instruments/:id` | 200 | 400 bad id, 404 not found |
| POST | `/instruments` | 201 | 400 validation |
| PUT | `/instruments/:id` | 200 | 400 validation, 404 not found |
| DELETE | `/instruments/:id` | 204 | 404 not found, 409 has loan history |

Body for POST / PUT:
```json
{ "name": "Violin", "family": "strings" }
```

### Search (query parameter)

```
GET /instruments?family=strings
```

### Twist – Pages of results

`GET /instruments` accepts `page` and `limit` (defaults **1** and **5**). It can be combined with `family`.

```
GET /instruments?page=1&limit=2
```
```json
{
  "total": 8,
  "page": 1,
  "limit": 2,
  "data": [
    { "id": 1, "name": "Violin", "family": "strings" },
    { "id": 2, "name": "Cello", "family": "strings" }
  ]
}
```

| Test | Request | Result |
|---|---|---|
| 1 | `?page=1&limit=2` | 200, 2 instruments |
| 2 | `?page=2&limit=2` | 200, the next 2 |
| 3 | `?page=0` | 400 |
| extra | `?limit=-1` | 400 |

### Musicians

| Method | URL | Success | Errors |
|---|---|---|---|
| GET | `/musicians` | 200 | |
| GET | `/musicians/:id` | 200 | 400, 404 |
| POST | `/musicians` | 201 | 400 (`name` required) |

### Loans – the JOIN endpoint

| Method | URL | Success | Errors |
|---|---|---|---|
| GET | `/loans` | 200 – loans with **musician name** and **instrument name** | |
| GET | `/loans/:id` | 200 | 400, 404 |
| POST | `/loans` | 201 | 400 validation, 404 musician/instrument not found, 409 already on loan |
| PATCH | `/loans/:id/return` | 200 | 404, 409 already returned |

```
GET /loans
```
```json
[
  { "id": 1, "musician_name": "Asha Rao", "instrument_name": "Violin", "loan_date": "2026-11-02", "return_date": null }
]
```

### Error format

Every error returns JSON with a clear message:
```json
{ "error": "family must be one of: strings, percussion, woodwind, brass, keyboard" }
```

---

## Postman

The full collection `BeatBox.postman_collection.json` puts together the Postman tests every member wrote for their own part (each member's folder has their own collection too).

1. Open Postman → **Import** → choose `BeatBox.postman_collection.json`.
2. Delete `beatbox.db` and run `npm start` (fresh sample data).
3. Right-click the collection → **Run collection**.

The collection has 25 requests with 48 automatic checks, in 4 folders:
1. Twist – pages of results (the 3 tests from the brief + extras)
2. Instruments CRUD
3. Validation and search
4. Musicians and loans (join)

`baseUrl` is a collection variable (default `http://localhost:3000`).

Command line option: `npx newman run BeatBox.postman_collection.json`

---

## Team (5 members)

Part 6 (Postman and README) is shared: every member wrote the Postman tests and README section for their own part.

| Member | Part | Postman tests | README section |
|---|---|---|---|
| Member 1 – _name_ | 1 Server and routes | `member1-server.postman_collection.json` | How to run, project structure |
| Member 2 – _name_ | 2 Database | `member2-database.postman_collection.json` | Database |
| Member 3 – _name_ | 3 REST endpoints + join | `member3-rest.postman_collection.json` | Endpoints |
| Member 4 – _name_ | 4 Validation and search | `member4-validation.postman_collection.json` | Search, error format |
| Member 5 – _name_ | 5 Twist rule | `member5-twist.postman_collection.json` | Twist, Postman, putting it together |

---

## Member 5 – twist demo notes
**Goal:** make the 3 twist tests pass.

`GET /instruments` accepts `page` and `limit` (defaults 1 and 5). The reply holds the total count, the page number and that page's data. `page=0` or a negative `limit` gets **400**.

### Run
```bash
npm install
npm start      # http://localhost:3000
npm test       # runs the 3 twist tests (+2 extras) on an in-memory database
```

### Try it
| Request | Result |
|---|---|
| `GET /instruments?page=1&limit=2` | 200, 2 instruments |
| `GET /instruments?page=2&limit=2` | 200, the next 2 |
| `GET /instruments?page=0` | 400 |
| `GET /instruments?limit=-1` | 400 |
| `GET /instruments?family=strings&page=1&limit=2` | works with search too |

### What this part added (look here in the demo)
- `routes/instruments.js` – the `GET /` route: reads `page` / `limit`, checks them, works out `offset = (page - 1) * limit`, returns `{ total, page, limit, data }`.
- `db.js` – `instruments.getAll()` now takes `limit` and `offset` (SQL `LIMIT ? OFFSET ?`), plus `instruments.count()` for the total.
- `test/twist.test.js` – automatic tests using Node's built-in test runner.

### Likely demo questions
- *Why offset = (page − 1) × limit?* Page 1 skips 0 rows, page 2 skips `limit` rows, and so on.
- *Why is total separate?* `data` is only one page; `total` tells the client how many pages exist (`Math.ceil(total / limit)`).
- *Why 400 and not 200 with empty data?* Page 0 or a negative limit is a bad request from the client. A page past the end is valid and returns empty `data`.
