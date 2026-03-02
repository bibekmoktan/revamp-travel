# Booking Module API Documentation

## Overview
The booking module provides comprehensive booking management functionality including creation, confirmation, cancellation, and retrieval of travel bookings with proper inventory management and payment tracking.

## Base URL
```
/api/bookings
```

## Authentication
All endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

## Endpoints

### 1. Create Booking
Creates a new booking with automatic inventory management.

**Endpoint:** `POST /api/bookings`

**Authentication:** Required (User)

**Request Body:**
```json
{
  "packageId": "string",
  "trekDate": "2024-03-15T10:00:00.000Z",
  "idempotencyKey": "optional-unique-key-123",
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

**Response:**
```json
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": "507f1f77bcf86cd799439012",
      "trekDate": "2024-03-15T10:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2024-03-15T10:15:00.000Z",
      "createdAt": "2024-03-15T10:00:00.000Z",
      "updatedAt": "2024-03-15T10:00:00.000Z"
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
        "createdAt": "2024-03-15T10:00:00.000Z",
        "updatedAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

**Validation Rules:**
- `packageId`: Required, valid package ID
- `trekDate`: Required, ISO datetime string
- `idempotencyKey`: Optional, 8-200 characters, prevents duplicate bookings
- `travelers`: Required, 1-20 travelers
- `traveler.fullName`: Required, 2-200 characters
- `traveler.age`: Optional, 0-120
- `traveler.gender`: Optional, max 20 characters
- `traveler.idProof`: Optional, max 200 characters

**Business Logic:**
- Automatically reserves seats in inventory
- Calculates total amount based on package price
- Sets 15-minute expiration for payment
- Idempotent operations prevent duplicates

---

### 2. Get My Bookings
Retrieves paginated list of user's bookings with optional filtering.

**Endpoint:** `GET /api/bookings/my`

**Authentication:** Required (User)

**Query Parameters:**
```
page: number (default: 1, min: 1)
limit: number (default: 10, min: 1, max: 100)
status: string (optional, values: reserved|confirmed|cancelled)
sortBy: string (default: createdAt, values: createdAt|trekDate|bookingStatus|totalAmount)
sortOrder: string (default: desc, values: asc|desc)
```

**Example Request:**
```
GET /api/bookings/my?page=1&limit=10&status=reserved&sortBy=createdAt&sortOrder=desc
```

**Response:**
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
      "trekDate": "2024-03-15T10:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2024-03-15T10:15:00.000Z",
      "createdAt": "2024-03-15T10:00:00.000Z"
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

### 3. Get Booking Details
Retrieves detailed information about a specific booking.

**Endpoint:** `GET /api/bookings/:bookingId`

**Authentication:** Required (User/Admin)

**Path Parameters:**
- `bookingId`: Required, valid booking ID

**Response:**
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
      "trekDate": "2024-03-15T10:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "reserved",
      "expiresAt": "2024-03-15T10:15:00.000Z",
      "createdAt": "2024-03-15T10:00:00.000Z"
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
        "createdAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

**Authorization Rules:**
- Users can only view their own bookings
- Admins can view any booking

---

### 4. Cancel Booking
Cancels a booking and releases inventory back to the pool.

**Endpoint:** `PATCH /api/bookings/:bookingId/cancel`

**Authentication:** Required (User/Admin)

**Path Parameters:**
- `bookingId`: Required, valid booking ID

**Request Body (Optional):**
```json
{
  "reason": "Change of plans"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Booking cancelled successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": "507f1f77bcf86cd799439012",
      "trekDate": "2024-03-15T10:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "cancelled",
      "expiresAt": "2024-03-15T10:15:00.000Z",
      "createdAt": "2024-03-15T10:00:00.000Z",
      "updatedAt": "2024-03-15T10:30:00.000Z"
    },
    "travelers": [
      {
        "_id": "507f1f77bcf86cd799439013",
        "booking": "507f1f77bcf86cd799439011",
        "fullName": "John Doe",
        "age": 30,
        "gender": "male",
        "idProof": "PASS123456",
        "status": "cancelled",
        "createdAt": "2024-03-15T10:00:00.000Z",
        "updatedAt": "2024-03-15T10:30:00.000Z"
      }
    ]
  }
}
```

**Business Logic:**
- Releases inventory seats back to available pool
- Cancels all associated travelers
- Updates booking status to 'cancelled'
- Logs cancellation for audit trail

**Authorization Rules:**
- Users can only cancel their own bookings
- Admins can cancel any booking

---

### 5. Confirm Booking
Confirms a booking (Admin only).

**Endpoint:** `PATCH /api/bookings/:bookingId/confirm`

**Authentication:** Required (Admin only)

**Path Parameters:**
- `bookingId`: Required, valid booking ID

**Response:**
```json
{
  "success": true,
  "message": "Booking confirmed successfully",
  "data": {
    "booking": {
      "_id": "507f1f77bcf86cd799439011",
      "user": "507f1f77bcf86cd799439010",
      "package": "507f1f77bcf86cd799439012",
      "trekDate": "2024-03-15T10:00:00.000Z",
      "numberOfPeople": 2,
      "totalAmount": 50000,
      "paymentStatus": "pending",
      "bookingStatus": "confirmed",
      "expiresAt": "2024-03-15T10:15:00.000Z",
      "createdAt": "2024-03-15T10:00:00.000Z",
      "updatedAt": "2024-03-15T10:45:00.000Z"
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
        "createdAt": "2024-03-15T10:00:00.000Z"
      }
    ]
  }
}
```

**Business Logic:**
- Updates booking status to 'confirmed'
- Cannot confirm already cancelled bookings
- Logs confirmation for audit trail

**Authorization Rules:**
- Only admins can confirm bookings

---

## Data Models

### Booking Status Values
- `reserved`: Initial state after booking creation
- `confirmed`: Booking confirmed by admin
- `cancelled`: Booking cancelled by user/admin or expired

### Payment Status Values
- `pending`: Awaiting payment
- `paid`: Payment completed
- `failed`: Payment failed

### Traveler Status Values
- `active`: Active traveler in booking
- `cancelled`: Traveler removed from booking

## Error Responses

### Validation Error (400)
```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "packageId",
      "message": "packageId is required"
    },
    {
      "field": "travelers",
      "message": "At least one traveler is required"
    }
  ]
}
```

### Not Found Error (404)
```json
{
  "success": false,
  "message": "Booking not found"
}
```

### Conflict Error (409)
```json
{
  "success": false,
  "message": "Duplicate booking request"
}
```

### Authorization Error (403)
```json
{
  "success": false,
  "message": "You can only view your own bookings"
}
```

### Server Error (500)
```json
{
  "success": false,
  "message": "Internal server error"
}
```

## Rate Limiting
- Booking creation: 5 requests per minute per user
- Other endpoints: 100 requests per minute per user

## Pagination
All list endpoints support pagination with the following parameters:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- Response includes `meta` object with pagination info

## Idempotency
Booking creation supports idempotency to prevent duplicate bookings:
- Include `idempotencyKey` in request body
- Same key with same payload returns existing booking
- Keys expire after 24 hours

## Webhooks (Future Enhancement)
Planned webhook events:
- `booking.created`: New booking created
- `booking.confirmed`: Booking confirmed
- `booking.cancelled`: Booking cancelled
- `booking.expired`: Booking expired

## SDK Examples

### JavaScript/Node.js
```javascript
// Create booking
const response = await fetch('/api/bookings', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + token
  },
  body: JSON.stringify({
    packageId: '507f1f77bcf86cd799439012',
    trekDate: '2024-03-15T10:00:00.000Z',
    travelers: [{
      fullName: 'John Doe',
      age: 30,
      gender: 'male'
    }]
  })
});

const booking = await response.json();
```

### Python
```python
import requests

# Get user bookings
headers = {
    'Authorization': 'Bearer ' + token,
    'Content-Type': 'application/json'
}

response = requests.get(
    '/api/bookings/my?page=1&limit=10',
    headers=headers
)

bookings = response.json()
```

## Testing

### Test Environment
- Use test API endpoint: `/api/test/bookings`
- Test database with sample data
- Mock payment gateway for testing

### Test Cases
- Booking creation with valid/invalid data
- Idempotency key handling
- Permission-based access control
- Inventory management
- Pagination and sorting
- Error handling

## Monitoring & Analytics

### Available Metrics
- Booking creation rate
- Confirmation rate
- Cancellation rate
- Revenue per period
- Popular packages
- User demographics

### Analytics Endpoints
- `GET /api/analytics/bookings/stats` - Booking statistics
- `GET /api/analytics/bookings/revenue` - Revenue analytics
- `GET /api/analytics/bookings/popular` - Popular packages
- `GET /api/analytics/bookings/demographics` - User demographics

## Support
For API support and questions:
- Documentation: [Link to docs]
- Support email: support@example.com
- Status page: [Link to status page]

## Changelog

### v2.0.0 (Current)
- Added comprehensive analytics
- Improved performance with database indexes
- Enhanced error handling
- Added automated cleanup service
- Improved type safety

### v1.0.0
- Initial booking functionality
- Basic CRUD operations
- Inventory management
- User authentication
