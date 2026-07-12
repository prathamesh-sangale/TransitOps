# Authentication Database Integration Contract

This document defines the schema requirements that the PostgreSQL database guarantees to the `auth` branch and backend middleware.

## The `users` Table Contract

### 1. Identity Columns
- `id` (UUID): The primary key. This is extracted and serialized as the `sub` claim in the stateless JWT.
- `email` (VARCHAR): The authentication lookup key. 
  - **Constraint**: Must be `UNIQUE`.
  - **Normalization**: The database schema enforces a lowercased unique index (`unique_users_email_lower`). The backend auth service will lowercase emails before querying.

### 2. Password Security
- `password_hash` (TEXT): 
  - **Constraint**: Must be `NOT NULL`.
  - **Requirement**: Must contain a strictly `bcrypt`-compatible hash (e.g. `$2a$12$...`).
  - **Boundary**: Plaintext passwords are NEVER stored. The backend `password.js` utility compares the incoming request password against this hash.

### 3. Role-Based Access Control (RBAC)
- `role` (user_role ENUM):
  - **Constraint**: Must be `NOT NULL`.
  - **Canonical Values**:
    - `FLEET_MANAGER`
    - `DISPATCHER`
    - `SAFETY_OFFICER`
    - `FINANCIAL_ANALYST`
  - **Authority**: The backend `authorize` middleware queries the database for this exact string to determine route access. It does NOT trust role claims embedded in the JWT.

### 4. Immediate Session Revocation
- `is_active` (BOOLEAN):
  - **Constraint**: Must be `NOT NULL DEFAULT TRUE`.
  - **Authority**: The backend `authenticate` middleware queries the user row by ID on *every* protected request. If `is_active` is `false`, the request is immediately rejected with a `403`. This allows instantaneous revocation of all active JWT sessions without a token blacklist.

## Security Boundaries
1. **Stateless JWT**: The database does NOT store active session tokens.
2. **No Public Registration**: The database does not support open signup. Users must be provisioned operationally.
3. **No Database RLS for Auth**: The Express backend operates via a direct connection pool. The backend is the trusted authority for RBAC, not Supabase Row Level Security.
