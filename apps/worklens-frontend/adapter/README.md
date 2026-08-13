Adapter README

1. Copy `.env.example` to `.env` and fill DB credentials.

2. Install dependencies and start:

```bash
cd adapter
npm install
npm start
```

3. The adapter listens on `PORT` (default 3001) and exposes:
- GET /records
- GET /records/:name
- PUT /records/:name  (body: [{recordStatusId,isAllowed,isDefault}])
- GET /records/:name/allowed

The adapter will create a `record_statuses` table if it doesn't exist.
