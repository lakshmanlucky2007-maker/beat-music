# Member 3 – REST endpoints

**Goal:** CRUD for instruments and the join endpoint.

## Run
```bash
npm install
npm start      # http://localhost:3000
```

## Instruments CRUD
| Method | URL | Status |
|---|---|---|
| GET | `/instruments` | 200 |
| GET | `/instruments/:id` | 200 / 404 |
| POST | `/instruments` `{ "name": "Sitar", "family": "strings" }` | 201 |
| PUT | `/instruments/:id` `{ "name": "...", "family": "..." }` | 200 / 404 |
| DELETE | `/instruments/:id` | 204 / 404 / 409 if it has loans |

## The join endpoint
`GET /loans` returns each loan with the **musician name** and **instrument name** (SQL `JOIN` in `db.js`):
```json
{ "id": 1, "musician_name": "Asha Rao", "instrument_name": "Violin", "loan_date": "2026-11-02", "return_date": null }
```

## Also
- `POST /loans` `{ "musician_id": 2, "instrument_id": 5 }` → 201, or 409 if the instrument is still out
- `PATCH /loans/:id/return` → marks the instrument as returned
- `GET/POST /musicians`

## Files to look at
- `routes/instruments.js`, `routes/loans.js`, `routes/musicians.js`

Note: input validation is not in this part yet (empty name gives a server error) – that is added in **4-validation-and-search**.

## Likely demo questions
- *Why 201 for POST?* Created – a new row exists.
- *Why 204 for DELETE?* Success with no body to send back.
- *Why 409 when deleting an instrument with loans?* It would break the loan history (foreign key), so it's a conflict.

## My share of part 6 – Postman and README
- **Postman:** `member3-rest.postman_collection.json` – 12 requests: full instrument CRUD, delete with loans 409, the JOIN, borrow / borrow-again 409 / return.
  Import it in Postman, delete `beatbox.db`, `npm start`, then **Run collection**. All checks pass.
- **README:** I wrote the **Endpoints** tables (instruments, musicians, loans) of the final README (in `member5-twist-pagination/README.md`).
