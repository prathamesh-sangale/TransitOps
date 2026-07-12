# TransitOps Backend

This is the Express.js backend for the TransitOps platform. It serves as the operational API layer connecting the React frontend to the Supabase PostgreSQL database.

## Tech Stack
- **Node.js**
- **Express.js** (API Framework)
- **PostgreSQL / pg** (Database Driver)
- **Zod** (Validation)
- **dotenv, helmet, cors, morgan** (Environment & Security)

## Folder Architecture
```
backend/
├── src/
│   ├── app.js                 # Express app setup, middlewares, central router
│   ├── server.js              # HTTP server, DB check, graceful shutdown
│   ├── config/                # Environment and Database configuration
│   ├── constants/             # Domain constants (statuses, roles)
│   ├── controllers/           # Request/Response handling (thin layer)
│   ├── services/              # Business logic, aggregations, formatting
│   ├── repositories/          # Parameterized SQL database queries
│   ├── routes/                # Express routing declarations
│   ├── middleware/            # Error handler, 404 handler, Zod validation
│   ├── utils/                 # Pagination, FieldMapper, ApiError, AsyncHandler
│   └── validators/            # Zod validation schemas
├── .env.example
├── package.json
└── README.md
```

## Environment Variables
Copy `.env.example` to `.env` and fill in the values.
- `NODE_ENV`: development or production
- `PORT`: API Port (default 5000)
- `DATABASE_URL`: Full PostgreSQL connection string (Do not use the Supabase Anon key here).
- `FRONTEND_ORIGIN`: Allowed CORS origin (e.g., http://localhost:5173)

## Supabase PostgreSQL Connection Strategy
The backend connects securely via the standard Postgres connection string (`DATABASE_URL`). A centralized `pg.Pool` is initialized in `config/database.js` which performs an early connectivity check on server startup. SSL is conditionally enforced in production.

## Running the Project
1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. The server starts at `http://localhost:5000`.

## API Conventions
- **Prefix**: All endpoints are prefixed with `/api`.
- **Health**: `GET /api/health`
- **Response Format**:
  ```json
  {
    "success": true,
    "data": { ... },
    "meta": { "page": 1, "limit": 20, "total": 50 } // for collections
  }
  ```
- **Error Format**:
  ```json
  {
    "success": false,
    "error": { "code": "RESOURCE_NOT_FOUND", "message": "Not found" }
  }
  ```
- **Field Mapping**: Database tables use `snake_case`. API payloads strictly use `camelCase`. `src/utils/fieldMapper.js` handles this boundary.

## Important Note on Authentication & Authorization
Currently, the operational read APIs are implemented but do **NOT** enforce JWT authentication or RBAC authorization. 
The final implementation of authentication middleware, JWT validation, and RBAC enforcement belongs to the `auth` branch and will be integrated in a future phase. Do not add fake role-header authorizations here.

## Transactional Operational Workflows
The backend employs a strict SQL transaction and row-level locking (`SELECT ... FOR UPDATE`) strategy for all operational state changes (Trip Lifecycle & Maintenance Lifecycle).
- **Atomicity**: Dispatching, completing, cancelling trips, or maintaining vehicles modifies multiple entities. The `withTransaction` utility executes these safely in a single connection.
- **Lock Order**: To prevent deadlocks, transactions always lock in the conceptual order: `Trip` (or `Maintenance`) → `Vehicle` → `Driver`.
- **Database Constraints**: Partial unique indexes prevent race conditions (e.g. assigning an already assigned driver). The central error handler securely maps these unique constraint failures to `409 Conflict`.
