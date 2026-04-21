# API Testing Guide

**Base URL:** `http://localhost:3002/api/v1`  
**Auth:** All protected routes require `Authorization: Bearer <token>` header.

---

## 1. Auth

### Register
```bash
curl -X POST http://localhost:3002/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "Password123",
    "role": "user"
  }'
```
**Response `201`**
```json
{
  "success": true,
  "message": "Registration successful",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "user": { "_id": "...", "name": "John Doe", "email": "john@example.com", "role": "user" }
  }
}
```
**Validation rules:** `name` 2–100 chars (letters/spaces only), `email` valid format, `password` min 8 chars with uppercase + lowercase + number, `role` optional (`user` | `admin`, defaults to `user`).

---

### Login
```bash
curl -X POST http://localhost:3002/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john@example.com",
    "password": "Password123"
  }'
```
**Response `200`**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "<jwt>",
    "refreshToken": "<jwt>",
    "user": { "_id": "...", "name": "John Doe", "role": "user" }
  }
}
```

---

### Refresh Token
```bash
curl -X POST http://localhost:3002/api/v1/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{ "refreshToken": "<refresh_jwt>" }'
```
**Response `200`**
```json
{ "success": true, "message": "Token refreshed", "data": { "accessToken": "<new_jwt>" } }
```

---

### Forgot Password
```bash
curl -X POST http://localhost:3002/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{ "email": "john@example.com" }'
```
**Response `200`** — Always returns the same message regardless of whether the email exists (prevents enumeration).
```json
{ "success": true, "message": "If that email exists, a reset link has been sent" }
```

---

### Reset Password
```bash
curl -X POST http://localhost:3002/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "token": "<raw_token_from_email>",
    "password": "NewPassword123"
  }'
```
**Response `200`**
```json
{ "success": true, "message": "Password reset successful" }
```
Token is valid for **15 minutes**. Returns `401` if expired or invalid.

---

## 2. Users

> All user routes are currently **unprotected** (admin middleware not yet wired). Plan to add `protect + authorize('admin')` before deploying publicly.

### Create User
```bash
curl -X POST http://localhost:3002/api/v1/users \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "Password123"
  }'
```

### Get All Users
```bash
curl http://localhost:3002/api/v1/users
```

### Get User by ID
```bash
curl http://localhost:3002/api/v1/users/<userId>
```

### Update User
```bash
curl -X PUT http://localhost:3002/api/v1/users/<userId> \
  -H "Content-Type: application/json" \
  -d '{ "name": "Jane Updated" }'
```

### Update Password
```bash
curl -X PATCH http://localhost:3002/api/v1/users/<userId>/password \
  -H "Content-Type: application/json" \
  -d '{
    "currentPassword": "Password123",
    "newPassword": "NewPassword456"
  }'
```

### Delete User
```bash
curl -X DELETE http://localhost:3002/api/v1/users/<userId>
```

---

## 3. Packages

### Create Package (Admin only)
```bash
curl -X POST http://localhost:3002/api/v1/packages \
  -H "Authorization: Bearer <admin_token>" \
  -F "featureImage=@/path/to/image.jpg" \
  -F 'data={
    "title": "Everest Base Camp Trek",
    "category": "trekking",
    "duration": "14 days",
    "price": 25000,
    "description": "A challenging trek to the base of the world highest mountain offering stunning views.",
    "highlights": ["Khumbu Icefall views", "Namche Bazaar"],
    "includes": ["Guide", "Porter", "Meals"],
    "location": "Solukhumbu, Nepal",
    "difficulty": "challenging",
    "altitude": "5364m",
    "groupSize": "1-16",
    "bestSeason": ["Spring", "Autumn"],
    "itinerary": [
      {
        "day": 1,
        "title": "Fly to Lukla",
        "description": "Take an early morning flight from Kathmandu to Lukla and begin the trek.",
        "activities": ["Flight to Lukla", "Trek to Phakding"]
      }
    ],
    "status": "active"
  }'
```

### Get All Packages (Public)
```bash
# With filters
curl "http://localhost:3002/api/v1/packages?category=trekking&minPrice=10000&maxPrice=50000&page=1&limit=10&sortBy=price&sortOrder=asc"

# Search by keyword
curl "http://localhost:3002/api/v1/packages?searchTerm=everest&status=active"
```
**Query params:** `searchTerm`, `category`, `minPrice`, `maxPrice`, `status` (`active`|`inactive`), `page`, `limit` (max 100), `sortBy` (`createdAt`|`updatedAt`|`title`|`price`|`rating`), `sortOrder` (`asc`|`desc`).

### Get Package by Slug (Public)
```bash
curl http://localhost:3002/api/v1/packages/everest-base-camp-trek
```

### Update Package (Admin only)
```bash
curl -X PATCH http://localhost:3002/api/v1/packages/<packageId> \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{ "price": 27000, "status": "active" }'
```

### Update Package Status (Admin only)
```bash
curl -X PATCH http://localhost:3002/api/v1/packages/<packageId>/status \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{ "status": "inactive" }'
```

### Delete Package (Admin only)
```bash
curl -X DELETE http://localhost:3002/api/v1/packages/<packageId> \
  -H "Authorization: Bearer <admin_token>"
```

---

## 4. Reviews

### Create Review (Auth required)
```bash
curl -X POST http://localhost:3002/api/v1/reviews \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "package": "<packageId>",
    "rating": 5,
    "title": "Amazing experience",
    "comment": "The trek was absolutely stunning. Would recommend to anyone."
  }'
```
**Note:** `user` field is set automatically from the JWT — do not send it in the body.  
**Validation:** `rating` 1–5, `comment` 10–2000 chars, `title` optional max 200 chars. One review per user per package (unique constraint).

### Get All Reviews (Public)
```bash
# Filter by package
curl "http://localhost:3002/api/v1/reviews?package=<packageId>&page=1&limit=10"

# Filter by rating and verified
curl "http://localhost:3002/api/v1/reviews?rating=5&isVerified=true&sortBy=helpfulCount&sortOrder=desc"
```

### Get Review by ID (Public)
```bash
curl http://localhost:3002/api/v1/reviews/<reviewId>
```

### Update Review (Owner only)
```bash
curl -X PATCH http://localhost:3002/api/v1/reviews/<reviewId> \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "rating": 4, "comment": "Updated review comment with more detail." }'
```

### Delete Review (Owner or Admin)
```bash
curl -X DELETE http://localhost:3002/api/v1/reviews/<reviewId> \
  -H "Authorization: Bearer <token>"
```

### Respond to Review (Admin only)
```bash
curl -X PATCH http://localhost:3002/api/v1/reviews/<reviewId>/respond \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{ "text": "Thank you for your feedback. We are glad you enjoyed the experience." }'
```

### Verify Review (Admin only)
```bash
curl -X PATCH http://localhost:3002/api/v1/reviews/<reviewId>/verify \
  -H "Authorization: Bearer <admin_token>" \
  -H "Content-Type: application/json" \
  -d '{ "isVerified": true }'
```

---

## 5. Bookings

### Create Booking (Auth required)
```bash
curl -X POST http://localhost:3002/api/v1/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "<packageId>",
    "trekDate": "2025-04-15T00:00:00.000Z",
    "idempotencyKey": "unique-client-key-001",
    "travelers": [
      { "fullName": "John Doe", "age": 30, "gender": "male", "idProof": "PASS123456" },
      { "fullName": "Jane Doe", "age": 28, "gender": "female", "idProof": "PASS789012" }
    ]
  }'
```
**Validation rules:**
- `trekDate` must be ISO datetime string — inventory must exist for that date
- `travelers` min 1, max 20
- `idempotencyKey` optional, 8–200 chars — prevents duplicate bookings on retry
- Booking expires in **15 minutes** if not confirmed

**Response `201`**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "...",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "bookingStatus": "reserved",
      "paymentStatus": "pending",
      "expiresAt": "2025-04-15T00:15:00.000Z"
    },
    "travelers": [
      { "_id": "...", "fullName": "John Doe", "status": "active" },
      { "_id": "...", "fullName": "Jane Doe", "status": "active" }
    ]
  }
}
```

---

### Get My Bookings (Auth required)
```bash
curl "http://localhost:3002/api/v1/bookings/my?page=1&limit=10&status=reserved&sortBy=createdAt&sortOrder=desc" \
  -H "Authorization: Bearer <token>"
```
**Query params:** `page`, `limit`, `status` (`reserved`|`confirmed`|`cancelled`), `sortBy` (`createdAt`|`trekDate`|`bookingStatus`), `sortOrder` (`asc`|`desc`).

---

### Get Booking by ID (Auth required — own booking or admin)
```bash
curl http://localhost:3002/api/v1/bookings/<bookingId> \
  -H "Authorization: Bearer <token>"
```

---

### Cancel Booking (Auth required — own booking or admin)
```bash
curl -X PATCH http://localhost:3002/api/v1/bookings/<bookingId>/cancel \
  -H "Authorization: Bearer <token>"
```
Cancelling restores inventory seats automatically.

---

### Confirm Booking (Admin only)
```bash
curl -X PATCH http://localhost:3002/api/v1/bookings/<bookingId>/confirm \
  -H "Authorization: Bearer <admin_token>"
```

---

## 6. Health Check

```bash
curl http://localhost:3002/health
```
**Response when healthy `200`**
```json
{
  "success": true,
  "status": "healthy",
  "db": "connected",
  "timestamp": "2025-04-15T10:00:00.000Z"
}
```
**Response when DB is down `503`**
```json
{
  "success": false,
  "status": "degraded",
  "db": "disconnected",
  "timestamp": "2025-04-15T10:00:00.000Z"
}
```

---

## 7. Common Error Responses

| HTTP | Scenario |
|------|----------|
| `400` | Validation failed — check `message` field for details |
| `401` | Missing, expired, or invalid Bearer token |
| `403` | Authenticated but not authorized (e.g. non-admin on admin route) |
| `404` | Resource not found |
| `409` | Conflict — duplicate email, slug, or review |
| `429` | Rate limit exceeded (auth routes: stricter limit) |
| `500` | Unexpected server error |
| `503` | DB unavailable (health check only) |

**Error shape:**
```json
{
  "success": false,
  "message": "Human-readable error reason"
}
```

---

## 8. Booking Lifecycle

```
POST /bookings
      │
      ▼
  "reserved"  ──── 15 min expiry (auto-cancelled by cleanup job)
      │
      ├── PATCH /bookings/:id/cancel  →  "cancelled" (inventory restored)
      │
      └── PATCH /bookings/:id/confirm (admin)  →  "confirmed"
```

---

## 9. Idempotency

Send the same `idempotencyKey` on retry — the API returns the original booking without creating a duplicate or re-charging inventory.

```bash
# First attempt (creates booking)
curl -X POST http://localhost:3002/api/v1/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "<packageId>",
    "trekDate": "2025-04-15T00:00:00.000Z",
    "idempotencyKey": "checkout-session-abc123",
    "travelers": [{ "fullName": "John Doe" }]
  }'

# Retry (same key — returns same booking, no duplicate)
curl -X POST http://localhost:3002/api/v1/bookings \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "packageId": "<packageId>",
    "trekDate": "2025-04-15T00:00:00.000Z",
    "idempotencyKey": "checkout-session-abc123",
    "travelers": [{ "fullName": "John Doe" }]
  }'
```

---

## 10. Rate Limits

Auth endpoints (`/auth/login`, `/auth/register`, `/auth/forgot-password`, `/auth/reset-password`) have a stricter rate limiter applied. Exceeding it returns `429 Too Many Requests`.
