# Booking Module — API Documentation

## Overview
Manages travel booking creation, confirmation, cancellation, and retrieval with automatic inventory management and 15-minute reservation expiry.

## Base URL
```
http://localhost:3002/api/v1/bookings
```

## Authentication
All endpoints require a valid JWT access token:
```
Authorization: Bearer <access_token>
```
Obtain a token from `POST /api/v1/auth/login` or `POST /api/v1/auth/register`.

---

## Endpoints

### POST /
Create a new booking and reserve seats in inventory.

**Auth:** User (required)

**Request Body**
```json
{
  "packageId": "507f1f77bcf86cd799439012",
  "trekDate": "2025-04-15T00:00:00.000Z",
  "idempotencyKey": "checkout-session-abc123",
  "travelers": [
    {
      "fullName": "John Doe",
      "age": 30,
      "gender": "male",
      "idProof": "PASS123456"
    },
    {
      "fullName": "Jane Doe",
      "age": 28,
      "gender": "female",
      "idProof": "PASS789012"
    }
  ]
}
```

| Field | Type | Required | Rules |
|---|---|---|---|
| `packageId` | string | Yes | Valid package ObjectId |
| `trekDate` | string | Yes | ISO 8601 datetime — inventory must exist for this date |
| `idempotencyKey` | string | No | 8–200 chars — retrying with the same key returns the original booking |
| `travelers` | array | Yes | 1–20 items |
| `travelers[].fullName` | string | Yes | 2–200 chars |
| `travelers[].age` | number | No | Integer 0–120 |
| `travelers[].gender` | string | No | Max 20 chars |
| `travelers[].idProof` | string | No | Max 200 chars |

**Response `201`**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": "507f1f77bcf86cd799439012",
      "trekDate": "2025-04-15T00:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2025-04-15T00:15:00.000Z",
      "createdAt": "2025-04-15T00:00:00.000Z",
      "updatedAt": "2025-04-15T00:00:00.000Z"
    },
    "travelers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "booking": "507f1f77bcf86cd799439011",
        "fullName": "John Doe",
        "age": 30,
        "gender": "male",
        "idProof": "PASS123456",
        "status": "active",
        "createdAt": "2025-04-15T00:00:00.000Z"
      }
    ]
  }
}
```

**Business rules**
- Seats are reserved atomically via a Mongoose transaction (10s timeout).
- `totalAmount` = package `price` × number of travelers.
- Booking expires in **15 minutes**. The cleanup job cancels expired `reserved` bookings and restores inventory every 5 minutes.
- Duplicate idempotency keys return the existing booking without touching inventory.

**Errors**
| Code | Reason |
|---|---|
| `400` | Validation failed, package inactive, or no inventory for the date |
| `401` | Missing or invalid token |
| `404` | Package not found |
| `409` | Duplicate idempotency key with conflicting data |

---

### GET /my
Retrieve the authenticated user's bookings (paginated).

**Auth:** User (required)

**Query Parameters**
| Param | Type | Default | Options |
|---|---|---|---|
| `page` | number | `1` | ≥ 1 |
| `limit` | number | `10` | 1–100 |
| `status` | string | — | `reserved` \| `confirmed` \| `cancelled` |
| `sortBy` | string | `createdAt` | `createdAt` \| `trekDate` \| `bookingStatus` |
| `sortOrder` | string | `desc` | `asc` \| `desc` |

**Example**
```
GET /api/v1/bookings/my?page=1&limit=10&status=reserved&sortBy=trekDate&sortOrder=asc
```

**Response `200`**
```json
{
  "success": true,
  "message": "Bookings retrieved successfully",
  "data": [
    {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Everest Base Camp Trek",
        "price": 25000
      },
      "trekDate": "2025-04-15T00:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2025-04-15T00:15:00.000Z",
      "createdAt": "2025-04-15T00:00:00.000Z"
    }
  ],
  "meta": {
    "total": 25,
    "page": 1,
    "limit": 10,
    "pages": 3
  }
}
```

---

### GET /:bookingId
Retrieve a single booking with its travelers.

**Auth:** User (own booking) or Admin (any booking)

**Path Params**
| Param | Type | Required |
|---|---|---|
| `bookingId` | string | Yes |

**Response `200`**
```json
{
  "success": true,
  "message": "Booking group retrieved successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": {
        "_id": "507f1f77bcf86cd799439012",
        "title": "Everest Base Camp Trek",
        "price": 25000
      },
      "trekDate": "2025-04-15T00:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2025-04-15T00:15:00.000Z",
      "createdAt": "2025-04-15T00:00:00.000Z"
    },
    "travelers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "fullName": "John Doe",
        "age": 30,
        "gender": "male",
        "idProof": "PASS123456",
        "status": "active",
        "createdAt": "2025-04-15T00:00:00.000Z"
      }
    ]
  }
}
```

**Errors**
| Code | Reason |
|---|---|
| `400` | Attempting to view another user's booking (non-admin) |
| `404` | Booking not found |

---

### PATCH /:bookingId/cancel
Cancel a booking and release all reserved seats back to inventory.

**Auth:** User (own booking) or Admin (any booking)

**Path Params**
| Param | Type | Required |
|---|---|---|
| `bookingId` | string | Yes |

> Request body is not required. The cancellation reason is not currently persisted.

**Response `200`**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "bookingStatus": "cancelled",
      "paymentStatus": "pending",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "trekDate": "2025-04-15T00:00:00.000Z",
      "updatedAt": "2025-04-15T00:30:00.000Z"
    },
    "travelers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "fullName": "John Doe",
        "status": "cancelled"
      }
    ]
  }
}
```

**Business rules**
- Cancelling an already-`cancelled` booking is a no-op (returns current state, does not error).
- Active traveler count is used to calculate how many seats to release.
- All active travelers are set to `cancelled` in the same transaction.
- Runs inside a 10s transaction timeout.

**Errors**
| Code | Reason |
|---|---|
| `400` | Attempting to cancel another user's booking (non-admin) |
| `404` | Booking not found |

---

### PATCH /:bookingId/confirm
Confirm a reserved booking.

**Auth:** Admin only

**Path Params**
| Param | Type | Required |
|---|---|---|
| `bookingId` | string | Yes |

**Response `200`**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "bookingStatus": "confirmed",
      "paymentStatus": "pending",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "trekDate": "2025-04-15T00:00:00.000Z",
      "updatedAt": "2025-04-15T00:45:00.000Z"
    },
    "travelers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "fullName": "John Doe",
        "status": "active"
      }
    ]
  }
}
```

**Business rules**
- Confirming an already-`cancelled` booking is a no-op — the status will not change.
- Does not affect inventory (seats stay reserved).

**Errors**
| Code | Reason |
|---|---|
| `401` | Not authenticated |
| `403` | Authenticated but not admin |
| `404` | Booking not found |

---

## Data Models

### Booking Status
| Value | Description |
|---|---|
| `reserved` | Created, awaiting confirmation. Expires in 15 minutes. |
| `confirmed` | Confirmed by admin. |
| `cancelled` | Cancelled by user/admin, or expired by cleanup job. |

### Payment Status
| Value | Description |
|---|---|
| `pending` | Awaiting payment |
| `paid` | Payment received |
| `failed` | Payment failed |

### Traveler Status
| Value | Description |
|---|---|
| `active` | Traveler is part of an active booking |
| `cancelled` | Booking was cancelled or expired |

---

## Booking Lifecycle

```
POST /
  └─► bookingStatus: "reserved"  (inventory reserved, 15-min expiry clock starts)
        │
        ├─► PATCH /:id/cancel ──► bookingStatus: "cancelled"  (inventory released)
        │
        ├─► PATCH /:id/confirm ──► bookingStatus: "confirmed"
        │
        └─► [cleanup job, every 5 min] ──► bookingStatus: "cancelled"  (if expiresAt < now)
```

---

## Rate Limiting

| Scope | Window | Limit |
|---|---|---|
| Global (all routes) | 15 minutes | 100 req/IP (prod) / 1000 (dev) |
| Auth routes only | 15 minutes | 5 req/IP |

Rate limit headers are returned in every response:
```
RateLimit-Limit: 100
RateLimit-Remaining: 99
RateLimit-Reset: 1713225600
```

---

## Idempotency

Include `idempotencyKey` in the request body to safely retry a booking without creating duplicates.

- The key is scoped per user — the same key used by a different user creates a new booking.
- If the key already exists for that user, the original booking and its travelers are returned with no inventory change.
- The key has no automatic expiry; it persists as long as the booking document exists.

```json
{
  "packageId": "...",
  "trekDate": "2025-04-15T00:00:00.000Z",
  "idempotencyKey": "checkout-session-abc123",
  "travelers": [{ "fullName": "John Doe" }]
}
```

---

## Standard Error Shape

All errors follow this structure:

```json
{
  "success": false,
  "message": "Human-readable reason"
}
```

| HTTP Code | Meaning |
|---|---|
| `400` | Validation failed or business rule violation |
| `401` | Missing, expired, or malformed Bearer token |
| `403` | Authenticated but insufficient role |
| `404` | Resource not found |
| `409` | Conflict (duplicate idempotency key) |
| `429` | Rate limit exceeded |
| `500` | Unexpected server error |

---

## SDK Examples

### JavaScript / TypeScript
```typescript
const BASE = 'http://localhost:3002/api/v1';

// Create a booking
const res = await fetch(`${BASE}/bookings`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${accessToken}`,
  },
  body: JSON.stringify({
    packageId: '507f1f77bcf86cd799439012',
    trekDate: '2025-04-15T00:00:00.000Z',
    travelers: [{ fullName: 'John Doe', age: 30, gender: 'male' }],
  }),
});
const { data } = await res.json();

// Get my bookings
const list = await fetch(`${BASE}/bookings/my?page=1&limit=10`, {
  headers: { 'Authorization': `Bearer ${accessToken}` },
});
const { data: bookings, meta } = await list.json();
```

### Python
```python
import requests

BASE = 'http://localhost:3002/api/v1'
headers = {'Authorization': f'Bearer {access_token}', 'Content-Type': 'application/json'}

# Create a booking
res = requests.post(f'{BASE}/bookings', json={
    'packageId': '507f1f77bcf86cd799439012',
    'trekDate': '2025-04-15T00:00:00.000Z',
    'travelers': [{'fullName': 'John Doe', 'age': 30}],
}, headers=headers)
booking = res.json()['data']['booking']

# Cancel a booking
requests.patch(f'{BASE}/bookings/{booking["_id"]}/cancel', headers=headers)
```
