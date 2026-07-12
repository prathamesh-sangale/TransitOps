# Backend Transaction Requirements

This document outlines the strict transaction logic that the backend Express service MUST enforce. The database schema maintains structural integrity, while these workflows represent the operational integrity.

## DISPATCH TRIP
1. Begin transaction.
2. Lock or safely read the target trip.
3. Verify trip is `DRAFT`.
4. Validate vehicle exists.
5. Validate vehicle is `AVAILABLE`.
6. Validate driver exists.
7. Validate driver is `AVAILABLE`.
8. Validate driver license has not expired (relative to current date).
9. Validate trip cargo weight does not exceed vehicle max load capacity.
10. Validate active vehicle trip conflict (though DB partial index provides a safety net).
11. Validate active driver trip conflict (though DB partial index provides a safety net).
12. Update trip to `DISPATCHED`.
13. Assign vehicle (`vehicle_id`).
14. Assign driver (`driver_id`).
15. Set `dispatched_at` timestamp.
16. Update vehicle to `ON_TRIP`.
17. Update driver to `ON_TRIP`.
18. Commit.
19. Roll back on any failure.

## COMPLETE TRIP
1. Begin transaction.
2. Validate trip is `DISPATCHED`.
3. Update trip to `COMPLETED`.
4. Set `completed_at` timestamp.
5. Return vehicle to `AVAILABLE` (where valid, e.g. not inherently retired).
6. Return driver to `AVAILABLE` (where valid).
7. Commit.

## CANCEL DISPATCHED TRIP
1. Begin transaction.
2. Validate current lifecycle allows cancellation (e.g. `DISPATCHED`).
3. Update trip to `CANCELLED`.
4. Set `cancelled_at` timestamp.
5. Store `cancellation_reason` where provided.
6. Release vehicle (Set `AVAILABLE`).
7. Release driver (Set `AVAILABLE`).
8. Commit.

## CREATE MAINTENANCE
1. Begin transaction.
2. Validate vehicle exists.
3. Validate vehicle lifecycle permits maintenance (e.g., not `RETIRED`).
4. Validate no active maintenance conflict (The DB `unique_active_maintenance` index enforces this structurally).
5. Create `ACTIVE` maintenance record.
6. Update vehicle status to `IN_SHOP`.
7. Commit.

## COMPLETE MAINTENANCE
1. Begin transaction.
2. Validate `ACTIVE` maintenance record exists.
3. Update maintenance record to `COMPLETED`.
4. Set `completed_at` timestamp.
5. Return vehicle to `AVAILABLE` unless lifecycle rules (e.g. `RETIRED`) prevent it.
6. Commit.
