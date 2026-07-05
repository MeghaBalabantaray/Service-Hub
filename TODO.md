# TODO - Fix all bugs (ServiceHub)

## Step 1: Confirm runtime stability
- [x] Identify and resolve port 3001 collision (EADDRINUSE) by stopping existing process
- [x] Fix missing image upload dependency/runtime (multer) and wire uploads route


## Step 2: Backend correctness
- [ ] Add input validation for bookings/reviews/service updates
- [ ] Fix any authorization/role edge-cases in `server/routes/*`

## Step 3: Frontend correctness
- [ ] Remove incorrect/unused fields in UI data mapping (ensure API response -> UI mapping is correct)
- [ ] Implement missing API calls for:
  - Booking flow ("Book Service")
  - Review submission ("Reviews" section)
  - Auth flow (Login/Register)
  - Favorites persistence handling (if token present)

## Step 4: Testing
- [ ] Smoke test API endpoints (health, services search, details)
- [ ] Smoke test auth + bookings + reviews
- [ ] Run frontend build

## Step 5: Final pass
- [ ] Search for remaining TODO/FIXME and runtime console errors
- [ ] Ensure consistent error responses and status codes

