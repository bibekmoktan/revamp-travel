import http from 'k6/http';
import { check, sleep } from 'k6';

export let options = {
  stages: [
    { duration: '2m', target: 10 }, // Ramp up to 10 users
    { duration: '5m', target: 10 }, // Stay at 10 users
    { duration: '2m', target: 0 },  // Ramp down
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
    http_req_failed: ['rate<0.1'],    // Error rate should be less than 10%
  },
};

const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';
const USER_TOKEN = __ENV.USER_TOKEN || 'test-jwt-token';

export default function() {
  // Test 1: Create Individual Package Booking
  const individualBookingPayload = JSON.stringify({
    packageId: '507f1f77bcf86cd799440001',
    trekDate: '2024-04-15T00:00:00.000Z',
    travelers: [{
      fullName: `Load Test User ${__VU}`,
      age: 25 + (__VU % 30),
      gender: __VU % 2 ? 'male' : 'female',
      idProof: `PASS${1000 + __VU}`
    }]
  });

  const individualParams = {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${USER_TOKEN}`,
    },
  };

  let individualResponse = http.post(`${BASE_URL}/api/bookings`, individualBookingPayload, individualParams);
  check(individualResponse, {
    'individual booking created successfully': (r) => r.status === 201,
    'individual booking response time < 500ms': (r) => r.timings.duration < 500,
    'individual booking has success flag': (r) => JSON.parse(r.body).success === true,
  });

  sleep(1);

  // Test 2: Create Group Package Booking
  const groupTravelers = Array(5).fill().map((_, i) => ({
    fullName: `Group User ${__VU}-${i}`,
    age: 20 + (i * 5),
    gender: i % 2 ? 'male' : 'female',
    idProof: `GROUP${__VU}${i}00`
  }));

  const groupBookingPayload = JSON.stringify({
    packageId: '507f1f77bcf86cd799440002',
    trekDate: '2024-05-01T00:00:00.000Z',
    travelers: groupTravelers
  });

  let groupResponse = http.post(`${BASE_URL}/api/bookings`, groupBookingPayload, individualParams);
  check(groupResponse, {
    'group booking created successfully': (r) => r.status === 201,
    'group booking response time < 500ms': (r) => r.timings.duration < 500,
    'group booking has 5 travelers': (r) => JSON.parse(r.body).data.travelers.length === 5,
  });

  sleep(1);

  // Test 3: Get User Bookings
  let getBookingsResponse = http.get(`${BASE_URL}/api/bookings/my?page=1&limit=10`, individualParams);
  check(getBookingsResponse, {
    'get bookings successful': (r) => r.status === 200,
    'get bookings response time < 300ms': (r) => r.timings.duration < 300,
    'get bookings has data array': (r) => Array.isArray(JSON.parse(r.body).data),
  });

  sleep(1);

  // Test 4: Get Booking Details (if we have a booking ID)
  if (individualResponse.status === 201) {
    const bookingData = JSON.parse(individualResponse.body);
    const bookingId = bookingData.data.booking._id;
    
    let getBookingResponse = http.get(`${BASE_URL}/api/bookings/${bookingId}`, individualParams);
    check(getBookingResponse, {
      'get booking details successful': (r) => r.status === 200,
      'get booking details response time < 300ms': (r) => r.timings.duration < 300,
      'get booking details has booking data': (r) => JSON.parse(r.body).data.booking !== undefined,
    });
  }

  sleep(2);
}

export function handleSummary(data) {
  return {
    'booking-load-test-summary.json': JSON.stringify(data, null, 2),
    stdout: textSummary(data, { indent: ' ', enableColors: true }),
  };
}
