# Branch Ownership

## BRANCH: frontend
**PRIMARY OWNERSHIP:** `frontend/`
**RESPONSIBILITIES:** React UI, Responsive implementation, Shared frontend components, API consumption, Frontend RBAC visibility.
**MUST NOT MODIFY:** `database/`, backend business services, backend authentication middleware.

## BRANCH: backend
**PRIMARY OWNERSHIP:** `backend/src/modules/` (except auth), `config/`, `utils/`
**RESPONSIBILITIES:** REST APIs, Business logic, Workflows (vehicles, drivers, trips, maintenance, etc).
**MUST NOT MODIFY:** `frontend/`, database schema directly, auth-owned security files.

## BRANCH: auth
**PRIMARY OWNERSHIP:** `backend/src/modules/auth/`, `backend/src/modules/users/`, `backend/src/middleware/auth.middleware.js`, `backend/src/middleware/rbac.middleware.js`, `backend/src/utils/jwt.js`, `backend/src/constants/roles.js`
**RESPONSIBILITIES:** Password security, Login, JWT, Authentication, RBAC, User management.
**MUST NOT MODIFY:** frontend feature modules, TransitOps business services, database schema directly.

## BRANCH: database
**PRIMARY OWNERSHIP:** `database/`, `docs/database-design.md`
**RESPONSIBILITIES:** PostgreSQL schema, SQL migrations, Seed data.
**MUST NOT MODIFY:** `frontend/`, backend controllers, backend services, auth implementation.
