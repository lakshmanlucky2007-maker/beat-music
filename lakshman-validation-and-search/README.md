# Member 4 – Validation and search

**Goal:** input checks with clear error messages, and search by a query parameter.

## Run
```bash
npm install
npm start      # http://localhost:3000
```

## What this part added (look here in the demo)
- `validation.js` – all the checks in one place:
  - `validateInstrument` – `name` required (max 50 chars), `family` must be one of `strings, percussion, woodwind, brass, keyboard`
  - `validateMusician` – `name` required
  - `validateLoan` – `musician_id` and `instrument_id` must be positive whole numbers
  - `checkId` – middleware that rejects ids like `/instruments/abc` with 400
- The routes call these on **add (POST)** and **update (PUT)** and return `400 { "error": "..." }`.
- Search: `GET /instruments?family=strings` (case-insensitive, unknown family → 400).

## Try it
| Request | Result |
|---|---|
| `POST /instruments` `{ "name": "", "family": "rock" }` | 400 – both problems listed in one message |
| `PUT /instruments/2` `{ "name": "Cello" }` | 400 – family is required |
| `GET /instruments/abc` | 400 – id must be a positive whole number |
| `GET /instruments?family=strings` | 200 – only strings |
| `GET /instruments?family=Percussion` | 200 – works in any case |

## Likely demo questions
- *Why 400?* The client sent bad data; 400 Bad Request tells them to fix it.
- *Why validate before the database?* So users get a clear message instead of a database error / 500.
- *Why trim and lowercase?* So `" Strings "` and `strings` are saved the same way and search finds them.

## My share of part 6 – Postman and README
- **Postman:** `member4-validation.postman_collection.json` – 11 requests: every 400 error message, trim + lowercase, search by family.
  Import it in Postman, delete `beatbox.db`, `npm start`, then **Run collection**. All checks pass.
- **README:** I wrote the **Search** and **Error format** sections of the final README (in `member5-twist-pagination/README.md`).
