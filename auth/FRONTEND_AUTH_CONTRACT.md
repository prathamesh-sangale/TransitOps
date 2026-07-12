# Frontend Auth Integration Contract

This document provides the integration details for the authentication workflows on the TransitOps platform.

## Base Architecture
- **Prefix**: `/api/auth`
- **Authentication**: Bearer Token (JWT).
- **Session invalidation**: Handled entirely on the frontend by discarding the JWT.

## Endpoints

### 1. POST `/api/auth/login`
Authenticates a user and provides an access token.

**Request:**
```json
{
  "email": "dispatcher@transitops.com",
  "password": "strongpassword"
}
```

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "accessToken": "eyJhbG...",
    "tokenType": "Bearer",
    "expiresIn": "8h",
    "user": {
      "id": "uuid",
      "name": "Jane Doe",
      "email": "dispatcher@transitops.com",
      "role": "DISPATCHER",
      "isActive": true
    }
  }
}
```

**Failure Scenarios:**
- `401 Unauthorized` with code `INVALID_CREDENTIALS`: "Invalid email or password" (used for both unknown email and wrong password to prevent enumeration).
- `403 Forbidden` with code `ACCOUNT_INACTIVE`: If `is_active` is false.
- `400 Bad Request` with code `VALIDATION_ERROR`: Missing or malformed email/password.

---

### 2. GET `/api/auth/me`
Retrieves the current authenticated user's profile based on the JWT `sub` and active database record. Requires `Authorization: Bearer <token>` header.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "name": "Jane Doe",
    "email": "dispatcher@transitops.com",
    "role": "DISPATCHER",
    "isActive": true
  }
}
```

**Failure Scenarios:**
- `401 Unauthorized` with code `AUTHENTICATION_REQUIRED`: Missing header/token.
- `401 Unauthorized` with code `TOKEN_EXPIRED`: JWT has expired.
- `401 Unauthorized` with code `INVALID_TOKEN`: Malformed token or invalid signature.
- `403 Forbidden` with code `ACCOUNT_INACTIVE`: User has been deactivated in the database since the token was issued.

---

### 3. POST `/api/auth/logout`
Acknowledges logout. Requires `Authorization: Bearer <token>` header.

**Success Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "message": "Successfully logged out."
  }
}
```

> **Note on Logout Strategy**: The backend implements stateless JWT. Calling this endpoint serves as an acknowledgement, but the frontend **must** clear the token from its local storage (e.g. `localStorage.removeItem('token')`) to actually terminate the session locally.

## Token Storage Best Practices
Store the access token securely on the frontend. The exact strategy (localStorage vs memory vs httpOnly cookies) should be aligned with the frontend architecture, but it must be attached to protected requests as `Authorization: Bearer <token>`.

## Role Definitions
The canonical roles provided in the user object are strictly validated against:
- `FLEET_MANAGER`
- `DISPATCHER`
- `SAFETY_OFFICER`
- `FINANCIAL_ANALYST`
