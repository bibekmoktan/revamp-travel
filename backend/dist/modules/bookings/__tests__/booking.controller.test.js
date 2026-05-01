"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const supertest_1 = __importDefault(require("supertest"));
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = require("../../app");
const booking_service_1 = require("../booking.service");
const booking_constants_1 = require("../booking.constants");
describe('Booking Controller', () => {
    let userToken;
    let adminToken;
    let testUser;
    let testAdmin;
    let testPackage;
    let testInventory;
    beforeAll(async () => {
        // Setup test data
        testUser = { _id: new mongoose_1.default.Types.ObjectId(), email: 'user@test.com', role: 'user' };
        testAdmin = { _id: new mongoose_1.default.Types.ObjectId(), email: 'admin@test.com', role: 'admin' };
        userToken = 'mock-user-jwt-token';
        adminToken = 'mock-admin-jwt-token';
        testPackage = { _id: new mongoose_1.default.Types.ObjectId(), title: 'Test Package', price: 25000 };
        testInventory = {
            package: testPackage._id,
            date: '2024-04-15T00:00:00.000Z',
            availableSeats: 20
        };
    });
    describe('POST /api/bookings', () => {
        test('should create booking successfully', async () => {
            const mockBookingResult = {
                booking: {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    numberOfPeople: 1,
                    totalAmount: 25000,
                    bookingStatus: booking_constants_1.BOOKING_STATUS.RESERVED,
                    paymentStatus: 'pending'
                },
                travelers: [{
                        _id: new mongoose_1.default.Types.ObjectId(),
                        fullName: 'John Doe',
                        status: booking_constants_1.TRAVELER_STATUS.ACTIVE
                    }]
            };
            jest.spyOn(booking_service_1.BookingService, 'createBooking').mockResolvedValue(mockBookingResult);
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                packageId: testPackage._id,
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
            expect(response.body.data.travelers).toHaveLength(1);
        });
        test('should validate required fields', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                travelers: [{
                        fullName: 'John Doe'
                    }]
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        test('should require authentication', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/bookings')
                .send({
                packageId: testPackage._id,
                trekDate: '2024-04-15T00:00:00.000Z',
                travelers: [{
                        fullName: 'John Doe'
                    }]
            });
            expect(response.status).toBe(401);
        });
    });
    describe('GET /api/bookings/my', () => {
        test('should get user bookings', async () => {
            const mockBookings = {
                data: [{
                        _id: new mongoose_1.default.Types.ObjectId(),
                        numberOfPeople: 2,
                        totalAmount: 50000,
                        bookingStatus: booking_constants_1.BOOKING_STATUS.RESERVED
                    }],
                meta: {
                    total: 1,
                    page: 1,
                    limit: 10,
                    pages: 1
                }
            };
            jest.spyOn(booking_service_1.BookingService, 'getMyBookings').mockResolvedValue(mockBookings);
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/bookings/my')
                .set('Authorization', `Bearer ${userToken}`)
                .query({ page: 1, limit: 10 });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveLength(1);
            expect(response.body.meta.total).toBe(1);
        });
        test('should validate query parameters', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .get('/api/bookings/my')
                .set('Authorization', `Bearer ${userToken}`)
                .query({ page: -1, limit: 0 });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
        });
    });
    describe('GET /api/bookings/:bookingId', () => {
        test('should get booking details', async () => {
            const mockBooking = {
                booking: {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    numberOfPeople: 1,
                    totalAmount: 25000,
                    bookingStatus: booking_constants_1.BOOKING_STATUS.RESERVED
                },
                travelers: [{
                        _id: new mongoose_1.default.Types.ObjectId(),
                        fullName: 'John Doe',
                        status: booking_constants_1.TRAVELER_STATUS.ACTIVE
                    }]
            };
            jest.spyOn(booking_service_1.BookingService, 'getBooking').mockResolvedValue(mockBooking);
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/bookings/${bookingId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.booking.numberOfPeople).toBe(1);
            expect(response.body.data.travelers).toHaveLength(1);
        });
        test('should return 404 for non-existent booking', async () => {
            jest.spyOn(booking_service_1.BookingService, 'getBooking').mockRejectedValue(new Error('Booking not found'));
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .get(`/api/bookings/${bookingId}`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(404);
            expect(response.body.success).toBe(false);
        });
    });
    describe('PATCH /api/bookings/:bookingId/cancel', () => {
        test('should cancel booking successfully', async () => {
            const mockCancelledBooking = {
                booking: {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    numberOfPeople: 1,
                    totalAmount: 25000,
                    bookingStatus: booking_constants_1.BOOKING_STATUS.CANCELLED
                },
                travelers: [{
                        _id: new mongoose_1.default.Types.ObjectId(),
                        fullName: 'John Doe',
                        status: booking_constants_1.TRAVELER_STATUS.CANCELLED
                    }]
            };
            jest.spyOn(booking_service_1.BookingService, 'cancelBooking').mockResolvedValue(mockCancelledBooking);
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .patch(`/api/bookings/${bookingId}/cancel`)
                .set('Authorization', `Bearer ${userToken}`)
                .send({ reason: 'Change of plans' });
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.booking.bookingStatus).toBe(booking_constants_1.BOOKING_STATUS.CANCELLED);
            expect(response.body.data.travelers[0].status).toBe(booking_constants_1.TRAVELER_STATUS.CANCELLED);
        });
        test('should require authentication', async () => {
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .patch(`/api/bookings/${bookingId}/cancel`)
                .send({ reason: 'Change of plans' });
            expect(response.status).toBe(401);
        });
    });
    describe('PATCH /api/bookings/:bookingId/confirm', () => {
        test('should confirm booking successfully (admin only)', async () => {
            const mockConfirmedBooking = {
                booking: {
                    _id: new mongoose_1.default.Types.ObjectId(),
                    numberOfPeople: 1,
                    totalAmount: 25000,
                    bookingStatus: booking_constants_1.BOOKING_STATUS.CONFIRMED
                },
                travelers: [{
                        _id: new mongoose_1.default.Types.ObjectId(),
                        fullName: 'John Doe',
                        status: booking_constants_1.TRAVELER_STATUS.ACTIVE
                    }]
            };
            jest.spyOn(booking_service_1.BookingService, 'confirmBooking').mockResolvedValue(mockConfirmedBooking);
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .patch(`/api/bookings/${bookingId}/confirm`)
                .set('Authorization', `Bearer ${adminToken}`);
            expect(response.status).toBe(200);
            expect(response.body.success).toBe(true);
            expect(response.body.data.booking.bookingStatus).toBe(booking_constants_1.BOOKING_STATUS.CONFIRMED);
        });
        test('should reject confirmation by non-admin', async () => {
            const bookingId = new mongoose_1.default.Types.ObjectId();
            const response = await (0, supertest_1.default)(app_1.app)
                .patch(`/api/bookings/${bookingId}/confirm`)
                .set('Authorization', `Bearer ${userToken}`);
            expect(response.status).toBe(403);
            expect(response.body.success).toBe(false);
        });
    });
    describe('Error Handling', () => {
        test('should handle validation errors', async () => {
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                packageId: 'invalid-id',
                trekDate: 'invalid-date',
                travelers: []
            });
            expect(response.status).toBe(400);
            expect(response.body.success).toBe(false);
            expect(response.body.errors).toBeDefined();
        });
        test('should handle service errors gracefully', async () => {
            jest.spyOn(booking_service_1.BookingService, 'createBooking').mockRejectedValue(new Error('Service error'));
            const response = await (0, supertest_1.default)(app_1.app)
                .post('/api/bookings')
                .set('Authorization', `Bearer ${userToken}`)
                .send({
                packageId: testPackage._id,
                trekDate: '2024-04-15T00:00:00.000Z',
                travelers: [{
                        fullName: 'John Doe',
                        age: 30,
                        gender: 'male'
                    }]
            });
            expect(response.status).toBe(500);
            expect(response.body.success).toBe(false);
        });
    });
    afterEach(() => {
        jest.restoreAllMocks();
    });
});
