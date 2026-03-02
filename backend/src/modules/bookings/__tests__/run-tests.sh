#!/bin/bash

# Booking Module Test Script
# This script provides comprehensive testing for the booking system

set -e

# Configuration
BASE_URL="${BASE_URL:-http://localhost:3000}"
USER_TOKEN="${USER_TOKEN:-test-user-jwt-token}"
ADMIN_TOKEN="${ADMIN_TOKEN:-test-admin-jwt-token}"

echo "🧪 Booking Module Test Suite"
echo "=========================="
echo "Base URL: $BASE_URL"
echo "Testing with user token and admin token"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Helper functions
print_test() {
    echo -e "${YELLOW}Testing: $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Function to make HTTP requests and check responses
test_endpoint() {
    local method=$1
    local endpoint=$2
    local data=$3
    local expected_status=$4
    local token=$5
    local description=$6
    
    print_test "$description"
    
    local curl_cmd="curl -s -w '%{http_code}' -X $method"
    curl_cmd+=" '$BASE_URL$endpoint'"
    
    if [ -n "$data" ]; then
        curl_cmd+=" -H 'Content-Type: application/json'"
        curl_cmd+=" -d '$data'"
    fi
    
    if [ -n "$token" ]; then
        curl_cmd+=" -H 'Authorization: Bearer $token'"
    fi
    
    local response=$(eval $curl_cmd)
    local status_code="${response: -3}"
    local body="${response%???}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_success "Status $status_code ✓"
        echo "Response: $body" | head -c 200
        echo ""
        return 0
    else
        print_error "Expected $expected_status, got $status_code"
        echo "Response: $body"
        return 1
    fi
}

# Test 1: Individual Package Booking - Single Traveler
echo "📋 Test 1: Individual Package Booking - Single Traveler"
echo "------------------------------------------------------"

individual_single_payload='{
  "packageId": "507f1f77bcf86cd799440001",
  "trekDate": "2024-04-15T00:00:00.000Z",
  "travelers": [{
    "fullName": "John Doe",
    "age": 30,
    "gender": "male",
    "idProof": "PASS123456"
  }]
}'

if test_endpoint "POST" "/api/bookings" "$individual_single_payload" "201" "$USER_TOKEN" "Create individual booking (1 traveler)"; then
    INDIVIDUAL_BOOKING_ID=$(echo $body | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Created booking ID: $INDIVIDUAL_BOOKING_ID"
fi

echo ""

# Test 2: Individual Package Booking - Family (4 travelers)
echo "📋 Test 2: Individual Package Booking - Family (4 travelers)"
echo "-----------------------------------------------------------"

individual_family_payload='{
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

test_endpoint "POST" "/api/bookings" "$individual_family_payload" "201" "$USER_TOKEN" "Create individual booking (4 travelers)"

echo ""

# Test 3: Group Package Booking - Minimum Group Size (5 travelers)
echo "📋 Test 3: Group Package Booking - Minimum Group Size (5 travelers)"
echo "----------------------------------------------------------------"

group_min_payload='{
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

if test_endpoint "POST" "/api/bookings" "$group_min_payload" "201" "$USER_TOKEN" "Create group booking (5 travelers)"; then
    GROUP_BOOKING_ID=$(echo $body | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    echo "Created group booking ID: $GROUP_BOOKING_ID"
fi

echo ""

# Test 4: Get User Bookings
echo "📋 Test 4: Get User Bookings"
echo "-------------------------"

test_endpoint "GET" "/api/bookings/my?page=1&limit=10" "" "200" "$USER_TOKEN" "Get user bookings with pagination"

echo ""

# Test 5: Get Booking Details
if [ -n "$INDIVIDUAL_BOOKING_ID" ]; then
    echo "📋 Test 5: Get Booking Details"
    echo "-----------------------------"
    
    test_endpoint "GET" "/api/bookings/$INDIVIDUAL_BOOKING_ID" "" "200" "$USER_TOKEN" "Get specific booking details"
    echo ""
fi

# Test 6: Confirm Booking (Admin only)
if [ -n "$INDIVIDUAL_BOOKING_ID" ]; then
    echo "📋 Test 6: Confirm Booking (Admin only)"
    echo "------------------------------------"
    
    test_endpoint "PATCH" "/api/bookings/$INDIVIDUAL_BOOKING_ID/confirm" "" "200" "$ADMIN_TOKEN" "Confirm booking as admin"
    
    # Test that non-admin cannot confirm
    test_endpoint "PATCH" "/api/bookings/$INDIVIDUAL_BOOKING_ID/confirm" "" "403" "$USER_TOKEN" "Try to confirm booking as user (should fail)"
    echo ""
fi

# Test 7: Cancel Booking
if [ -n "$GROUP_BOOKING_ID" ]; then
    echo "📋 Test 7: Cancel Booking"
    echo "------------------------"
    
    cancel_payload='{"reason": "Change of plans"}'
    test_endpoint "PATCH" "/api/bookings/$GROUP_BOOKING_ID/cancel" "$cancel_payload" "200" "$USER_TOKEN" "Cancel booking"
    echo ""
fi

# Test 8: Error Cases
echo "📋 Test 8: Error Cases"
echo "--------------------"

# Test invalid package ID
invalid_payload='{
  "packageId": "invalid-package-id",
  "trekDate": "2024-04-15T00:00:00.000Z",
  "travelers": [{"fullName": "Test User", "age": 25}]
}'

test_endpoint "POST" "/api/bookings" "$invalid_payload" "400" "$USER_TOKEN" "Invalid package ID"

# Test missing required fields
missing_fields_payload='{
  "travelers": [{"fullName": "Test User"}]
}'

test_endpoint "POST" "/api/bookings" "$missing_fields_payload" "400" "$USER_TOKEN" "Missing required fields"

# Test no authentication
test_endpoint "POST" "/api/bookings" "$individual_single_payload" "401" "" "No authentication"

echo ""

# Test 9: Idempotency
echo "📋 Test 9: Idempotency"
echo "-------------------"

idempotent_payload='{
  "packageId": "507f1f77bcf86cd799440001",
  "trekDate": "2024-04-15T00:00:00.000Z",
  "idempotencyKey": "test-idempotency-key-12345",
  "travelers": [{
    "fullName": "Idempotent User",
    "age": 25,
    "gender": "male"
  }]
}'

# First request
if test_endpoint "POST" "/api/bookings" "$idempotent_payload" "201" "$USER_TOKEN" "First request with idempotency key"; then
    IDEMPOTENT_BOOKING_ID=$(echo $body | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
fi

# Second request with same key
if test_endpoint "POST" "/api/bookings" "$idempotent_payload" "201" "$USER_TOKEN" "Second request with same idempotency key"; then
    second_booking_id=$(echo $body | grep -o '"_id":"[^"]*"' | head -1 | cut -d'"' -f4)
    if [ "$IDEMPOTENT_BOOKING_ID" = "$second_booking_id" ]; then
        print_success "Idempotency working correctly - same booking ID returned"
    else
        print_error "Idempotency failed - different booking IDs returned"
    fi
fi

echo ""

# Test 10: Performance Test (Simple timing)
echo "📋 Test 10: Performance Test"
echo "--------------------------"

echo "Testing response times for booking creation..."

start_time=$(date +%s%N)
test_endpoint "POST" "/api/bookings" "$individual_single_payload" "201" "$USER_TOKEN" "Performance test - booking creation"
end_time=$(date +%s%N)

duration=$((($end_time - $start_time) / 1000000))
echo "Response time: ${duration}ms"

if [ $duration -lt 500 ]; then
    print_success "Response time under 500ms ✓"
else
    print_error "Response time over 500ms - performance issue"
fi

echo ""

# Summary
echo "📊 Test Summary"
echo "==============="
echo "All tests completed. Check the results above for any failures."
echo ""
echo "🔧 Next Steps:"
echo "1. Fix any failed tests"
echo "2. Run load testing with K6 for performance validation"
echo "3. Test with real database and packages"
echo "4. Add integration tests with payment gateway"
echo ""
echo "📚 For more detailed testing, see:"
echo "- TESTING_GUIDE.md for comprehensive scenarios"
echo "- load-test.js for performance testing"
echo "- booking.service.test.ts for unit tests"
echo ""
echo "✨ Happy Testing! ✨"
