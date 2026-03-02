# Booking System Testing Guide

## Overview
This guide provides comprehensive testing scenarios for the booking system, covering both individual packages and group packages with realistic examples.

## Test Setup

### Prerequisites
1. **Test Database**: Clean MongoDB test instance
2. **Test User**: Valid user account with JWT token
3. **Test Packages**: At least 2 packages (individual and group)
4. **Test Inventory**: Available seats for test dates

### Test Data Setup

#### Create Test Packages
```javascript
// Individual Package (Everest Base Camp)
const individualPackage = {
  _id: "507f1f77bcf86cd799440001",
  title: "Everest Base Camp Trek",
  price: 25000,
  status: "active",
  maxGroupSize: 20,
  minGroupSize: 1
};

// Group Package (Annapurna Circuit)
const groupPackage = {
  _id: "507f1f77bcf86cd799440002", 
  title: "Annapurna Circuit Group Trek",
  price: 20000,
  status: "active",
  maxGroupSize: 15,
  minGroupSize: 5
};
```

#### Create Test Inventory
```javascript
// Individual Package Inventory
const individualInventory = {
  package: "507f1f77bcf86cd799440001",
  date: "2024-04-15T00:00:00.000Z",
  availableSeats: 20,
  totalSeats: 20
};

// Group Package Inventory  
const groupInventory = {
  package: "507f1f77bcf86cd799440002",
  date: "2024-05-01T00:00:00.000Z", 
  availableSeats: 15,
  totalSeats: 15
};
```

## Test Scenarios

### 1. Individual Package Testing

#### Scenario 1.1: Single Traveler Booking
**Test Case:** Book individual package for 1 person

```bash
# Request
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-04-15T00:00:00.000Z",
    "travelers": [{
      "fullName": "John Doe",
      "age": 30,
      "gender": "male",
      "idProof": "PASS123456"
    }]
  }'

# Expected Response
{
  "success": true,
  "message": "Booking created successfully",
  "data": {
    "booking": {
      "numberOfPeople": 1,
      "totalAmount": 25000,
      "bookingStatus": "reserved",
      "paymentStatus": "pending"
    },
    "travelers": [1 traveler]
  }
}

# Verification
- Inventory seats reduced by 1 (19 remaining)
- Booking status = "reserved"
- Payment status = "pending"
- ExpiresAt set to 15 minutes from now
```

#### Scenario 1.2: Multiple Travelers (Individual Package)
**Test Case:** Book individual package for family of 4

```bash
# Request
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001", 
    "trekDate": "2024-04-15T00:00:00.000Z",
    "travelers": [
      {
        "fullName": "John Doe",
        "age": 35,
        "gender": "male",
        "idProof": "PASS123456"
      },
      {
        "fullName": "Jane Doe", 
        "age": 32,
        "gender": "female",
        "idProof": "PASS789012"
      },
      {
        "fullName": "Mike Doe",
        "age": 12,
        "gender": "male"
      },
      {
        "fullName": "Sarah Doe",
        "age": 8,
        "gender": "female"
      }
    ]
  }'

# Expected Response
{
  "success": true,
  "data": {
    "booking": {
      "numberOfPeople": 4,
      "totalAmount": 100000, // 4 × 25000
      "bookingStatus": "reserved"
    },
    "travelers": [4 travelers]
  }
}

# Verification
- Inventory seats reduced by 4 (15 remaining)
- All travelers created with status "active"
- Total calculation correct
```

### 2. Group Package Testing

#### Scenario 2.1: Minimum Group Size Booking
**Test Case:** Book group package with minimum required travelers (5)

```bash
# Request
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440002",
    "trekDate": "2024-05-01T00:00:00.000Z", 
    "travelers": [
      {
        "fullName": "Alice Smith",
        "age": 28,
        "gender": "female",
        "idProof": "PASS111111"
      },
      {
        "fullName": "Bob Smith",
        "age": 30, 
        "gender": "male",
        "idProof": "PASS222222"
      },
      {
        "fullName": "Carol Smith",
        "age": 25,
        "gender": "female",
        "idProof": "PASS333333"
      },
      {
        "fullName": "David Smith",
        "age": 32,
        "gender": "male", 
        "idProof": "PASS444444"
      },
      {
        "fullName": "Eve Smith",
        "age": 27,
        "gender": "female",
        "idProof": "PASS555555"
      }
    ]
  }'

# Expected Response
{
  "success": true,
  "data": {
    "booking": {
      "numberOfPeople": 5,
      "totalAmount": 100000, // 5 × 20000
      "bookingStatus": "reserved"
    },
    "travelers": [5 travelers]
  }
}

# Verification
- Inventory seats reduced by 5 (10 remaining)
- Group size meets minimum requirement
- Pricing calculated correctly
```

#### Scenario 2.2: Maximum Group Size Booking
**Test Case:** Book group package with maximum travelers (15)

```bash
# Request (15 travelers - abbreviated for brevity)
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440002",
    "trekDate": "2024-05-01T00:00:00.000Z",
    "travelers": [
      {"fullName": "Traveler 1", "age": 25, "gender": "male"},
      {"fullName": "Traveler 2", "age": 30, "gender": "female"},
      // ... continue for 13 more travelers
      {"fullName": "Traveler 15", "age": 28, "gender": "male"}
    ]
  }'

# Expected Response
{
  "success": true,
  "data": {
    "booking": {
      "numberOfPeople": 15,
      "totalAmount": 300000, // 15 × 20000
      "bookingStatus": "reserved"
    },
    "travelers": [15 travelers]
  }
}

# Verification
- Inventory seats reduced by 15 (0 remaining)
- Group size at maximum capacity
- No more seats available for this date
```

### 3. Edge Cases and Error Testing

#### Scenario 3.1: Insufficient Inventory
**Test Case:** Try to book when no seats available

```bash
# After previous test, inventory is 0
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440002",
    "trekDate": "2024-05-01T00:00:00.000Z",
    "travelers": [{"fullName": "Test User", "age": 25}]
  }'

# Expected Response
{
  "success": false,
  "message": "Not enough seats available"
}

# Verification
- Booking creation fails
- Inventory unchanged (still 0)
- Appropriate error message
```

#### Scenario 3.2: Invalid Date
**Test Case:** Try to book for non-existent date

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-12-25T00:00:00.000Z", // No inventory for this date
    "travelers": [{"fullName": "Test User", "age": 25}]
  }'

# Expected Response
{
  "success": false,
  "message": "trekDate is not available for this package"
}
```

#### Scenario 3.3: Exceed Maximum Travelers
**Test Case:** Try to book more than 20 travelers

```bash
curl -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-04-15T00:00:00.000Z",
    "travelers": [21 travelers] // Exceeds limit
  }'

# Expected Response
{
  "success": false,
  "message": "Maximum 20 travelers are allowed"
}
```

### 4. Booking Lifecycle Testing

#### Scenario 4.1: Complete Booking Flow
**Test Case:** Full lifecycle from creation to confirmation

```bash
# Step 1: Create booking
bookingResponse=$(curl -s -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-04-15T00:00:00.000Z",
    "travelers": [{"fullName": "Test User", "age": 25}]
  }')

bookingId=$(echo $bookingResponse | jq -r '.data.booking._id')

# Step 2: Verify booking creation
curl -s -X GET http://localhost:3000/api/bookings/$bookingId \
  -H "Authorization: Bearer <jwt_token>"

# Expected: bookingStatus = "reserved", paymentStatus = "pending"

# Step 3: Confirm booking (Admin only)
curl -s -X PATCH http://localhost:3000/api/bookings/$bookingId/confirm \
  -H "Authorization: Bearer <admin_jwt_token>"

# Expected: bookingStatus = "confirmed"

# Step 4: Verify confirmation
curl -s -X GET http://localhost:3000/api/bookings/$bookingId \
  -H "Authorization: Bearer <jwt_token>"

# Expected: bookingStatus = "confirmed"
```

#### Scenario 4.2: Booking Cancellation
**Test Case:** Cancel booking and verify inventory restoration

```bash
# Step 1: Create booking
# (Same as Scenario 4.1)

# Step 2: Cancel booking
curl -s -X PATCH http://localhost:3000/api/bookings/$bookingId/cancel \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{"reason": "Change of plans"}'

# Expected: bookingStatus = "cancelled"

# Step 3: Verify inventory restoration
# Check inventory - seats should be restored

# Step 4: Verify traveler status
curl -s -X GET http://localhost:3000/api/bookings/$bookingId \
  -H "Authorization: Bearer <jwt_token>"

# Expected: All travelers status = "cancelled"
```

### 5. Idempotency Testing

#### Scenario 5.1: Duplicate Request Prevention
**Test Case:** Send same request twice with idempotency key

```bash
# First request
response1=$(curl -s -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-04-15T00:00:00.000Z",
    "idempotencyKey": "test-key-12345",
    "travelers": [{"fullName": "Test User", "age": 25}]
  }')

# Second request (same idempotencyKey)
response2=$(curl -s -X POST http://localhost:3000/api/bookings \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <jwt_token>" \
  -d '{
    "packageId": "507f1f77bcf86cd799440001",
    "trekDate": "2024-04-15T00:00:00.000Z", 
    "idempotencyKey": "test-key-12345",
    "travelers": [{"fullName": "Test User", "age": 25}]
  }')

# Verification
# Both responses should return the same booking
# Inventory should only be reduced once
# No duplicate bookings created
```

## Automated Testing Scripts

### Jest Test Suite Example
```javascript
describe('Booking System Tests', () => {
  let userToken, adminToken, individualPackage, groupPackage;

  beforeAll(async () => {
    // Setup test data
    userToken = await getTestUserToken();
    adminToken = await getTestAdminToken();
    individualPackage = await createTestPackage('individual');
    groupPackage = await createTestPackage('group');
  });

  describe('Individual Package Booking', () => {
    test('should create single traveler booking', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          packageId: individualPackage._id,
          trekDate: '2024-04-15T00:00:00.000Z',
          travelers: [{
            fullName: 'John Doe',
            age: 30,
            gender: 'male'
          }]
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data.booking.numberOfPeople).toBe(1);
      expect(response.body.data.booking.totalAmount).toBe(25000);
    });

    test('should create family booking', async () => {
      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          packageId: individualPackage._id,
          trekDate: '2024-04-15T00:00:00.000Z',
          travelers: [
            { fullName: 'Parent 1', age: 35 },
            { fullName: 'Parent 2', age: 32 },
            { fullName: 'Child 1', age: 8 },
            { fullName: 'Child 2', age: 5 }
          ]
        });

      expect(response.status).toBe(201);
      expect(response.body.data.booking.numberOfPeople).toBe(4);
      expect(response.body.data.travelers).toHaveLength(4);
    });
  });

  describe('Group Package Booking', () => {
    test('should create minimum group booking', async () => {
      const travelers = Array(5).fill().map((_, i) => ({
        fullName: `Traveler ${i + 1}`,
        age: 25 + i,
        gender: i % 2 ? 'male' : 'female'
      }));

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          packageId: groupPackage._id,
          trekDate: '2024-05-01T00:00:00.000Z',
          travelers
        });

      expect(response.status).toBe(201);
      expect(response.body.data.booking.numberOfPeople).toBe(5);
    });

    test('should create maximum group booking', async () => {
      const travelers = Array(15).fill().map((_, i) => ({
        fullName: `Traveler ${i + 1}`,
        age: 20 + i,
        gender: i % 2 ? 'male' : 'female'
      }));

      const response = await request(app)
        .post('/api/bookings')
        .set('Authorization', `Bearer ${userToken}`)
        .send({
          packageId: groupPackage._id,
          trekDate: '2024-05-01T00:00:00.000Z',
          travelers
        });

      expect(response.status).toBe(201);
      expect(response.body.data.booking.numberOfPeople).toBe(15);
    });
  });
});
```

### Load Testing Script
```javascript
// K6 load test example
import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
};

export default function() {
  const payload = JSON.stringify({
    packageId: '507f1f77bcf86cd799440001',
    trekDate: '2024-04-15T00:00:00.000Z',
    travelers: [{
      fullName: `Load Test User ${__VU}`,
      age: 25,
      gender: 'male'
    }]
  });

  const params = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${__ENV.JWT_TOKEN}`,
    },
  };

  let response = http.post('http://localhost:3000/api/bookings', payload, params);
  check(response, {
    'booking created successfully': (r) => r.status === 201,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  sleep(1);
}
```

## Performance Testing

### Test Metrics to Monitor
- **Response Time**: < 500ms for booking creation
- **Throughput**: > 100 bookings/second
- **Error Rate**: < 1% under normal load
- **Database Performance**: Query execution time
- **Inventory Accuracy**: No race conditions

### Test Scenarios
1. **Concurrent Bookings**: Multiple users booking same package
2. **Inventory Race Conditions**: Simultaneous seat reservations
3. **Peak Load**: Maximum expected user traffic
4. **Stress Testing**: Beyond normal capacity limits

## Test Checklist

### Functional Testing
- [ ] Individual package booking (1-20 travelers)
- [ ] Group package booking (5-15 travelers)
- [ ] Booking confirmation flow
- [ ] Booking cancellation with inventory restoration
- [ ] Expiration cleanup process
- [ ] Idempotency key handling
- [ ] Permission-based access control
- [ ] Input validation and error handling

### Performance Testing
- [ ] Response time benchmarks
- [ ] Concurrent user handling
- [ ] Database query optimization
- [ ] Inventory consistency under load
- [ ] Memory usage monitoring

### Integration Testing
- [ ] Payment gateway integration
- [ ] Email notification system
- [ ] Analytics data collection
- [ ] External API dependencies

### Security Testing
- [ ] Authentication and authorization
- [ ] Input sanitization
- [ ] SQL injection prevention
- [ ] Rate limiting effectiveness
- [ ] Data privacy compliance

This comprehensive testing guide ensures the booking system works correctly for both individual and group packages under various scenarios and load conditions.
