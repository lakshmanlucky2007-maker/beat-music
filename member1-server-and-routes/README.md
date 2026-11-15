# Member 1 – Server and routes

**Goal:** Express setup, routes for musicians, instruments and loans, and the right status codes.

Data is kept in memory (`data.js`) in this part so the server runs on its own. It is replaced by SQLite in **2-database**.

## Run
```bash
npm install
npm start      # http://localhost:3000
```

## Files
- `server.js` – creates the app, `express.json()`, mounts the 3 routers, 404 handler, error handler (bad JSON → 400, crash → 500)
- `routes/musicians.js`, `routes/instruments.js`, `routes/loans.js` – one `express.Router()` each
- `data.js` – sample arrays

## Routes
| Method | URL | Status |
|---|---|---|
| GET | `/` | 200 |
| GET | `/musicians`, `/instruments`, `/loans` | 200 |
| GET | `/musicians/:id`, `/instruments/:id`, `/loans/:id` | 200 / 404 |
| POST | `/musicians`, `/instruments`, `/loans` | 201 |
| PUT | `/instruments/:id` | 200 / 404 |
| DELETE | `/instruments/:id` | 204 / 404 |
| any | unknown route | 404 |

## Status codes used
| Code | Meaning |
|---|---|
| 200 | OK |
| 201 | Created (after POST) |
| 204 | No Content (after DELETE) |
| 400 | Bad Request (broken JSON) |
| 404 | Not Found |
| 500 | Server error |

## Likely demo questions
- *What does `express.json()` do?* Reads the JSON body so `req.body` works.
- *Why use routers?* Each resource has its own file; `server.js` stays short.
- *Why is the 404 handler last?* Express checks routes in order, so it only runs if nothing else matched.

## My share of part 6 – Postman and README
- **Postman:** `member1-server.postman_collection.json` – 12 requests: home, list and get-one routes, add/update/delete, unknown route 404, broken JSON 400.
  Import it in Postman, delete `beatbox.db`, `npm start`, then **Run collection**. All checks pass.
- **README:** I wrote the **How to run** and **Project structure** sections of the final README (in `member5-twist-pagination/README.md`).
