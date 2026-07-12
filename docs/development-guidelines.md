# Development Guidelines

## Engineering Rules
1. Inspect existing code before changing files.
2. Future phases are continuation phases.
3. Never recreate the project during a later phase.
4. Preserve working code from previous phases.
5. Reuse existing shared components.
6. Follow existing naming conventions.
7. Keep module boundaries strict.
8. Do not modify files owned by another branch unless an integration phase explicitly permits it.
9. Frontend pages do not contain raw database logic.
10. Controllers remain thin.
11. Services own business rules.
12. Repositories own SQL/database queries.
13. Zod owns request validation.
14. Backend RBAC is the security authority.
15. Frontend RBAC is only for UI visibility.
16. Database schema changes belong to the database branch.
17. Do not expose secrets.
18. Do not commit `.env`.
19. Do not use generic error messages when a meaningful operational error can be returned.
20. Run relevant build or startup verification before completing a phase.

## Responsive Development Contract
Every future frontend phase must verify these widths: 1440px, 1024px, 768px, 390px.
Mandatory checks: No page-level horizontal overflow, Sidebar behaves correctly, Mobile drawer works, Forms become single-column on mobile, Tables remain usable.
