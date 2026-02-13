# RideSync API – Request / Response Reference

Base URL: `http://localhost:8080`  
Auth: `Authorization: Bearer <JWT>` for all except `/auth/**`.

---

## Auth (no token)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| POST | `/auth/register` | `{ "name": "string", "email": "string", "password": "string" }` | `{ "success": true, "message": "..." }` |
| POST | `/auth/login` | `{ "email": "string", "password": "string" }` | `{ "accessToken": "jwt...", "tokenType": "Bearer", "userId", "name", "email", "role" }` |

---

## Employee (token required)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/rides` | Query: `page`, `size`, `source`, `destination` | `{ "content": [Ride], "totalPages", ... }` (Spring Page) |
| POST | `/rides/{rideId}/book` | No body | `201` + `BookingResponseDto` |
| POST | `/bookings` | `{ "rideId": 1 }` | `201` + `BookingResponseDto` (same as above) |
| GET | `/bookings/my` | None | `[ { "id", "bookingTime", "status", "ride": { ... } }, ... ]` |
| DELETE | `/bookings/{bookingId}` | None | `204 No Content` |

---

## Admin (token required, role ADMIN)

| Method | Path | Request | Response |
|--------|------|---------|----------|
| GET | `/admin/dashboard/stats` | None | `DashboardStatsDto` (counts) |
| GET | `/admin/rides` | Query: `page`, `size`, `sortBy` | `Page<RideResponseDto>` |
| GET | `/admin/rides/{id}` | None | `RideResponseDto` |
| POST | `/admin/rides` | `{ "sourceLocation", "destinationLocation", "rideDateTime" (ISO), "totalSeats" }` | `201` + `RideResponseDto` |
| PUT | `/admin/rides/{id}` | Same body as POST | `RideResponseDto` |
| DELETE | `/admin/rides/{id}` | None | `204 No Content` |
| GET | `/admin/users` | Query: `page`, `size`, `sortBy` | `Page<AdminUserResponseDto>` |
| DELETE | `/admin/users/{userId}` | None | `204 No Content` |
| GET | `/admin/bookings` | Query: `page`, `size`, `sortBy` | `Page<AdminBookingResponseDto>` |
| DELETE | `/admin/bookings/{bookingId}` | None | `204 No Content` |

---

## Booking flow (employee)

1. **List rides:** `GET /rides?page=0&size=10`
2. **Book:** `POST /rides/{rideId}/book` (no body) **or** `POST /bookings` with `{ "rideId": rideId }`
3. **My bookings:** `GET /bookings/my`
4. **Cancel:** `DELETE /bookings/{bookingId}`

The frontend uses `POST /rides/{rideId}/book` for booking.
