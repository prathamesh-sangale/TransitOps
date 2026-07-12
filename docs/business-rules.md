# Business Rules
1. Vehicle registration number must be unique.
2. IN_SHOP vehicles cannot be dispatched.
3. RETIRED vehicles cannot be dispatched.
4. Drivers with expired licenses cannot be dispatched.
5. SUSPENDED drivers cannot be dispatched.
6. A vehicle cannot have more than one active dispatched trip.
7. A driver cannot have more than one active dispatched trip.
8. Cargo weight cannot exceed vehicle maximum load capacity.
9. Dispatching a trip changes: Vehicle → ON_TRIP, Driver → ON_TRIP
10. Completing or cancelling a dispatched trip changes: Vehicle → AVAILABLE, Driver → AVAILABLE
11. Creating active maintenance changes: Vehicle → IN_SHOP
12. Closing maintenance changes: Vehicle → AVAILABLE (unless retired)
