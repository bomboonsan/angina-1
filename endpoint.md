# Dint Backend API Endpoints

Base URL: http://localhost:5002

- Swagger Docs: GET /docs
- Health: GET /health
- Root: GET /

Auth
- Some write endpoints require Bearer API Key.
- Header: Authorization: Bearer <API_KEY>
- Configure API_KEY in .env

CORS
- Allowed origins: http://localhost:3000, https://angina-1.vercel.app

Environment
- PORT (default 5002)
- DATABASE_URL (MariaDB; mysql provider)
- API_KEY (for write protection)
- CHANNEL_ACCESS_TOKEN (LINE Messaging API)

---

1) Agents

List agents
- GET /api/agents
- Query
  - q: string (search in agent_code)
  - limit: number (1-100, default 50)
  - offset: number (>=0)
  - sort: id | created_at | updated_at | agent_code (default id)
  - order: asc | desc (default desc)
- Response 200
  {
    "total": number,
    "items": [ { "id": number, "agent_code": string, "created_at": string, "updated_at": string } ],
    "limit": number,
    "offset": number
  }

Get agent by id
- GET /api/agents/:id
- Response 200: Agent
- Errors: 400 invalid id, 404 not found

Create agent (secured)
- POST /api/agents
- Auth: Bearer API_KEY
- Body: { "agent_code": string } (duplicates allowed; <=191 chars)
- Response 201: Agent
- Errors: 400 invalid payload

Update agent (secured)
- PUT /api/agents/:id
- Auth: Bearer API_KEY
- Body: { "agent_code": string }
- Response 200: Agent
- Errors: 400 invalid id/payload, 404 not found

Delete agent (secured)
- DELETE /api/agents/:id
- Auth: Bearer API_KEY
- Response 204
- Errors: 400 invalid id, 404 not found

Stats: Summary
- GET /api/agents/stats/summary
- Query: from, to (ISO datetime), q (search agent_code)
- Response 200
  { "total": number, "unique_agent_codes": number, "first_at": string|null, "last_at": string|null, "from": string|null, "to": string|null }

Stats: Top agent_code
- GET /api/agents/stats/top
- Query: from, to, q, limit (default 10, max 100)
- Response 200
  { "items": [ { "agent_code": string, "count": number } ], "limit": number, "from": string|null, "to": string|null }

Stats: Timeseries
- GET /api/agents/stats/timeseries
- Query: from, to, q, interval=day|month (default day)
- Response 200
  { "interval": "day"|"month", "items": [ { "date": "YYYY-MM-DD", "count": number } ], "from": string|null, "to": string|null }

Examples (fish)
- curl 'http://localhost:5002/api/agents?q=AG&limit=20&sort=created_at&order=asc'
- curl -X POST http://localhost:5002/api/agents -H 'Authorization: Bearer '$API_KEY -H 'Content-Type: application/json' -d '{"agent_code":"AG001"}'

---

2) Flex Message CMS

List
- GET /api/flex
- Query
  - q: string (search keyword/description)
  - limit, offset: number
  - status: draft|published
  - active: true|false
- Response 200
  { "total": number, "items": [FlexMsg], "limit": number, "offset": number }

Create (secured)
- POST /api/flex
- Auth: Bearer API_KEY
- Body
  {
    "keyword": string,            // case-sensitive exact match
    "alt_text": string,
    "content": object,            // LINE Flex Message JSON
    "description": string?,
    "is_active": boolean?,        // default true
    "status": "draft"|"published" // default published
  }
- Response 201: FlexMsg

Update (secured)
- PUT /api/flex/:id
- Auth: Bearer API_KEY
- Body: any subset of fields above
- Response 200: FlexMsg

Delete (secured)
- DELETE /api/flex/:id
- Auth: Bearer API_KEY
- Response 204

Import (secured)
- POST /api/flex/import?overwrite=true|false
- Auth: Bearer API_KEY
- Body: [ { same shape as Create } ] (array)
- Behavior
  - overwrite=true: delete existing records with same keyword before insert
- Response 201: { "count": number }

Example (fish)
- curl http://localhost:5002/api/flex
- curl -X POST http://localhost:5002/api/flex -H 'Authorization: Bearer '$API_KEY -H 'Content-Type: application/json' -d '{"keyword":"products","alt_text":"รายการสินค้า","content":{"type":"bubble","body":{}}}'
- curl -X POST 'http://localhost:5002/api/flex/import?overwrite=true' -H 'Authorization: Bearer '$API_KEY -H 'Content-Type: application/json' -d '[{"keyword":"products","alt_text":"สินค้า","content":{"type":"carousel","contents":[]}}]'

---

3) LINE Webhook

- POST /api/line_webhook
- Body: As sent by LINE Messaging API (events array)
- Behavior
  - When a text message arrives, match keyword case-sensitively to FlexMsg where is_active=true and status=published.
  - If found, replies with Flex message using CHANNEL_ACCESS_TOKEN.
  - If not found, do nothing (respond 200 to LINE).
- Note: Signature validation (X-Line-Signature) is not enabled.

Example webhook registration
- Set your webhook URL in LINE Developer Console to: https://<your-host>/api/line_webhook

---

4) Swagger
- GET /docs
- To call secured endpoints from Swagger UI
  - Click Authorize
  - Choose BearerAuth
  - Enter your API_KEY (value only)

---

Data Models
- Agent: { id, agent_code, created_at, updated_at }
- FlexMsg: { id, keyword, alt_text, content (JSON), description?, is_active, status: draft|published, created_at, updated_at }

Notes
- agent_code is allowed to be duplicated (for statistics collection)
- All times are ISO 8601 strings in UTC
