# TransitOps Demo Credentials

> [!WARNING]
> **DEVELOPMENT / DEMO ONLY**
> These credentials map to the local `seeds/01_seed_data.sql` script. The database stores these as bcrypt hashes (`$2a$12$...`). They must never be used in a production environment.

## Canonical Hackathon Users

Use these accounts to evaluate the distinct RBAC boundaries of the application.

| Role | Email | Password |
| :--- | :--- | :--- |
| **Fleet Manager** | `fleet.manager@transitops.demo` | `password123` |
| **Dispatcher** | `dispatcher@transitops.demo` | `password123` |
| **Safety Officer** | `safety.officer@transitops.demo` | `password123` |
| **Financial Analyst**| `finance.analyst@transitops.demo` | `password123` |

### Notes
- The database enforces uniqueness on the email address.
- The `is_active` flag is set to `true` for all demo users.
- The passwords are encrypted using `bcrypt` before being stored in the SQL seed. If you need to generate a new hash for development testing, you must use a standard bcrypt generator with 12 rounds.
