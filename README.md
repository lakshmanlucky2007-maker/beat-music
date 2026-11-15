# BeatBox Music Room – Theme 9: Instrument loans

Express + SQLite API for a team of **5 members**, with one folder per member. Each folder runs on its own (`npm install`, then `npm start`) and builds on the one before it.

Part 6 (Postman and README) is shared: each member has a Postman collection for their own part and wrote their section of the final README.

| Folder | Member | Part | Their Postman file |
|---|---|---|---|
| `srinidhi-server-and-routes` | srinidhi | Express setup, routers, status codes (in-memory data) | `member1-server.postman_collection.json` |
| `ram-database` | ram | `db.js`: 3 SQLite tables, foreign keys, sample data, queries | `member2-database.postman_collection.json` |
| `charan-rest-endpoints` | charan reddy | Instrument CRUD + `GET /loans` join | `member3-rest.postman_collection.json` |
| `lakshman-validation-and-search` | lakshman | `validation.js`, clear errors, `?family=` search | `member4-validation.postman_collection.json` |
| `pranitha-twist-pagination` | pranitha | `page` / `limit` twist + `npm test`, and **puts the final project together** | `member5-twist.postman_collection.json` |

**Hand in:** push `member5-twist-pagination` to GitHub. It has the complete code, the full README and the combined `BeatBox.postman_collection.json` (all members' tests together).

Needs Node.js 18+.
