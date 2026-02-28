# Travel Nepal API Documentation

## Overview

This API provides endpoints for managing travel packages, user authentication, and user management. All endpoints return JSON responses with consistent structure.

## Base URL
```
http://localhost:3002/api/v1
```

## Authentication

Most endpoints require authentication using Bearer tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... },
  "meta": { ... } // For paginated responses
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "code": "ERROR_CODE",
  "requestId": "uuid-for-tracking"
}
```

---

# Authentication Endpoints

## Login
Authenticate user and receive access tokens.

**Endpoint:** `POST /auth/login`

**Authentication:** None required

**Rate Limiting:** 5 requests per 15 minutes

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Validation Rules:**
- `email`: Valid email format, required
- `password`: Minimum 6 characters, required

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "user@example.com",
      "role": "user",
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  }
}
```

**Error Responses:**
- `401`: Invalid credentials
- `403`: Account blocked
- `429`: Too many login attempts
- `400`: Validation errors

---

# User Management Endpoints

## Create User
Create a new user account.

**Endpoint:** `POST /users`

**Authentication:** Admin only

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "user"
}
```

**Validation Rules:**
- `name`: 2-100 characters, letters and spaces only
- `email`: Valid email format, unique
- `password`: 8-128 characters, must contain uppercase, lowercase, and number
- `role`: "user" or "admin" (optional, defaults to "user")

**Response:**
```json
{
  "success": true,
  "message": "User created successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Get All Users
Retrieve a paginated list of users.

**Endpoint:** `GET /users`

**Authentication:** Admin only

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by name or email
- `role`: Filter by role ("user" or "admin")
- `isBlocked`: Filter by blocked status (true/false)

**Response:**
```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "name": "John Doe",
      "email": "john@example.com",
      "role": "user",
      "isBlocked": false,
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 25,
    "pages": 3
  }
}
```

## Get User by ID
Retrieve a specific user by ID.

**Endpoint:** `GET /users/:id`

**Authentication:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "User retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "user",
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Update User
Update user information.

**Endpoint:** `PUT /users/:id`

**Authentication:** Admin only

**Request Body:**
```json
{
  "name": "John Smith",
  "email": "johnsmith@example.com",
  "role": "admin",
  "isBlocked": false
}
```

**Response:**
```json
{
  "success": true,
  "message": "User updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "name": "John Smith",
    "email": "johnsmith@example.com",
    "role": "admin",
    "isBlocked": false,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## Delete User
Delete a user account.

**Endpoint:** `DELETE /users/:id`

**Authentication:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully",
  "data": {
    "message": "User deleted successfully"
  }
}
```

## Update User Password
Update a user's password.

**Endpoint:** `PATCH /users/:id/password`

**Authentication:** Admin only

**Request Body:**
```json
{
  "currentPassword": "OldPassword123",
  "newPassword": "NewPassword123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully",
  "data": {
    "message": "Password updated successfully"
  }
}
```

---

# Package Management Endpoints

## Create Package
Create a new travel package with images.

**Endpoint:** `POST /packages`

**Authentication:** Admin only

**Content-Type:** `multipart/form-data`

**Request Fields:**
- `data`: JSON string containing package data
- `featureImage`: Image file (max 1 file)
- `gallery`: Image files (max 10 files)

**Package Data Structure:**
```json
{
  "title": "Everest Base Camp Trek",
  "category": "trekking",
  "duration": "14 days",
  "price": 1500,
  "description": "An amazing trek to Everest Base Camp...",
  "highlights": ["Mountain views", "Sherpa culture", "Tea house stay"],
  "includes": ["Guide", "Porters", "Meals", "Accommodation"],
  "location": "Everest Region, Nepal",
  "difficulty": "challenging",
  "altitude": "5,364m",
  "groupSize": "2-12 people",
  "bestSeason": ["spring", "autumn"],
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival in Kathmandu",
      "description": "Welcome to Kathmandu...",
      "activities": ["Airport pickup", "Hotel check-in", "Briefing"]
    }
  ]
}
```

**Validation Rules:**
- `title`: 3-200 characters, required
- `slug`: 3-100 characters, lowercase letters, numbers, hyphens only (auto-generated if not provided)
- `category`: Required, max 50 characters
- `price`: Non-negative number, required
- `description`: 20-5000 characters, required
- `highlights`: Array of strings, at least 1 required
- `includes`: Array of strings, at least 1 required
- `location`: Required, max 200 characters
- `difficulty`: "easy", "moderate", "challenging", or "extreme" (optional)
- `groupSize`: Required, max 50 characters
- `bestSeason`: Array of strings, at least 1 required
- `itinerary`: Array of day objects, at least 1 required

**Response:**
```json
{
  "success": true,
  "message": "Package created successfully with media",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "slug": "everest-base-camp-trek",
    "title": "Everest Base Camp Trek",
    "category": "trekking",
    "rating": 0,
    "reviews": 0,
    "duration": "14 days",
    "price": 1500,
    "featureImage": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "packages/abc123"
    },
    "gallery": [
      {
        "url": "https://res.cloudinary.com/...",
        "public_id": "gallery/def456"
      }
    ],
    "description": "An amazing trek to Everest Base Camp...",
    "highlights": ["Mountain views", "Sherpa culture", "Tea house stay"],
    "includes": ["Guide", "Porters", "Meals", "Accommodation"],
    "location": "Everest Region, Nepal",
    "difficulty": "challenging",
    "altitude": "5,364m",
    "groupSize": "2-12 people",
    "bestSeason": ["spring", "autumn"],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kathmandu",
        "description": "Welcome to Kathmandu...",
        "activities": ["Airport pickup", "Hotel check-in", "Briefing"]
      }
    ],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Get All Packages
Retrieve a paginated list of travel packages.

**Endpoint:** `GET /packages`

**Authentication:** None required

**Query Parameters:**
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10)
- `search`: Search by title, location, or description
- `category`: Filter by category
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `sortBy`: Sort field ("createdAt", "updatedAt", "title", "price", "rating")
- `sortOrder`: Sort order ("asc" or "desc", default: "desc")
- `status`: Filter by status ("active" or "inactive")

**Response:**
```json
{
  "success": true,
  "message": "Packages retrieved successfully",
  "data": [
    {
      "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
      "slug": "everest-base-camp-trek",
      "title": "Everest Base Camp Trek",
      "category": "trekking",
      "rating": 4.5,
      "reviews": 127,
      "duration": "14 days",
      "price": 1500,
      "featureImage": {
        "url": "https://res.cloudinary.com/...",
        "public_id": "packages/abc123"
      },
      "location": "Everest Region, Nepal",
      "difficulty": "challenging",
      "status": "active",
      "createdAt": "2024-01-15T10:30:00.000Z",
      "updatedAt": "2024-01-15T10:30:00.000Z"
    }
  ],
  "meta": {
    "page": 1,
    "limit": 10,
    "total": 45,
    "pages": 5
  }
}
```

## Get Package by Slug
Retrieve a specific package by its slug.

**Endpoint:** `GET /packages/:slug`

**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "message": "Package retrieved successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "slug": "everest-base-camp-trek",
    "title": "Everest Base Camp Trek",
    "category": "trekking",
    "rating": 4.5,
    "reviews": 127,
    "duration": "14 days",
    "price": 1500,
    "featureImage": {
      "url": "https://res.cloudinary.com/...",
      "public_id": "packages/abc123"
    },
    "gallery": [
      {
        "url": "https://res.cloudinary.com/...",
        "public_id": "gallery/def456"
      }
    ],
    "description": "An amazing trek to Everest Base Camp...",
    "highlights": ["Mountain views", "Sherpa culture", "Tea house stay"],
    "includes": ["Guide", "Porters", "Meals", "Accommodation"],
    "location": "Everest Region, Nepal",
    "difficulty": "challenging",
    "altitude": "5,364m",
    "groupSize": "2-12 people",
    "bestSeason": ["spring", "autumn"],
    "itinerary": [
      {
        "day": 1,
        "title": "Arrival in Kathmandu",
        "description": "Welcome to Kathmandu...",
        "activities": ["Airport pickup", "Hotel check-in", "Briefing"]
      }
    ],
    "status": "active",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
}
```

## Update Package
Update package information.

**Endpoint:** `PATCH /packages/:id`

**Authentication:** Admin only

**Request Body:** (Partial package data)
```json
{
  "title": "Everest Base Camp Trek - Updated",
  "price": 1600,
  "description": "Updated description...",
  "status": "active"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Package updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "slug": "everest-base-camp-trek-updated",
    "title": "Everest Base Camp Trek - Updated",
    "price": 1600,
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## Update Package Status
Update package status (active/inactive).

**Endpoint:** `PATCH /packages/:id/status`

**Authentication:** Admin only

**Request Body:**
```json
{
  "status": "inactive"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Package status updated successfully",
  "data": {
    "_id": "64f8a1b2c3d4e5f6a7b8c9d0",
    "status": "inactive",
    "updatedAt": "2024-01-15T11:00:00.000Z"
  }
}
```

## Delete Package
Delete a travel package.

**Endpoint:** `DELETE /packages/:id`

**Authentication:** Admin only

**Response:**
```json
{
  "success": true,
  "message": "Package deleted successfully",
  "data": {
    "message": "Package deleted successfully"
  }
}
```

---

# Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Request validation failed |
| `AUTHENTICATION_ERROR` | Authentication failed |
| `AUTHORIZATION_ERROR` | Access denied/insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `CONFLICT` | Resource conflict (duplicate, etc.) |
| `DATABASE_ERROR` | Database operation failed |
| `RATE_LIMIT_ERROR` | Too many requests |
| `FILE_UPLOAD_ERROR` | File upload failed |

# Rate Limiting

- **General endpoints:** 100 requests per 15 minutes
- **Authentication endpoints:** 5 requests per 15 minutes
- Rate limit headers are included in responses:
  - `X-RateLimit-Limit`: Request limit
  - `X-RateLimit-Remaining`: Remaining requests
  - `X-RateLimit-Reset`: Reset time (Unix timestamp)

# File Upload Guidelines

- **Supported formats:** JPEG, PNG, WebP
- **Max file size:** 10MB per file
- **Feature image:** 1 file max
- **Gallery images:** 10 files max
- Files are uploaded to Cloudinary and URLs are stored in database

# Health Check

**Endpoint:** `GET /health`

**Authentication:** None required

**Response:**
```json
{
  "success": true,
  "message": "Server is healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "requestId": "uuid-for-tracking"
}
```
