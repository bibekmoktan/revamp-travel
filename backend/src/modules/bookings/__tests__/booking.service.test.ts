import request from 'supertest';
import mongoose from 'mongoose';
import { app } from '../../app';
import { BookingSummaryModel } from '../bookingSummary.model';
import { TravelerModel } from '../traveler.model';
import { PackageDateInventoryModel } from '../../package/packageDateInventory.model';
import { PackageModel } from '../../package/package.model';
import { BookingService } from '../booking.service';
import { BOOKING_CONSTANTS, BOOKING_STATUS, TRAVELER_STATUS } from '../booking.constants';

describe('Booking Service', () => {
  let userToken: string;
  let adminToken: string;
  let testUser: any;
  let testAdmin: any;
  let individualPackage: any;
  let groupPackage: any;
  let individualInventory: any;
  let groupInventory: any;

  beforeAll(async () => {
    // Connect to test database
    await mongoose.connect(process.env.MONGODB_TEST_URI || 'mongodb://localhost:27017/test-bookings');
    
    // Create test users
    testUser = await createTestUser('user');
    testAdmin = await createTestUser('admin');
    userToken = generateJWT(testUser);
    adminToken = generateJWT(testAdmin);

    // Create test packages
    individualPackage = await createTestPackage({
      title: 'Everest Base Camp Trek',
      price: 25000,
      maxGroupSize: 20,
      minGroupSize: 1,
      type: 'individual'
    });

    groupPackage = await createTestPackage({
      title: 'Annapurna Circuit Group Trek',
      price: 20000,
      maxGroupSize: 15,
      minGroupSize: 5,
      type: 'group'
    });

    // Create test inventory
    individualInventory = await createTestInventory(individualPackage._id, '2024-04-15', 20);
    groupInventory = await createTestInventory(groupPackage._id, '2024-05-01', 15);
  });

  afterAll(async () => {
    await cleanupTestData();
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    await BookingSummaryModel.deleteMany({});
    await TravelerModel.deleteMany({});
    await PackageDateInventoryModel.updateMany({}, { availableSeats: 20 });
  });

  describe('Individual Package Booking', () => {
    test('should create single traveler booking', async () => {
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male',
          idProof: 'PASS123456'
        }]
      };

      const result = await BookingService.createBooking(testUser._id, payload);

      expect(result).toBeDefined();
      expect(result.booking.numberOfPeople).toBe(1);
      expect(result.booking.totalAmount).toBe(25000);
      expect(result.booking.bookingStatus).toBe(BOOKING_STATUS.RESERVED);
      expect(result.booking.paymentStatus).toBe('pending');
      expect(result.travelers).toHaveLength(1);
      expect(result.travelers[0].fullName).toBe('John Doe');
      expect(result.travelers[0].status).toBe(TRAVELER_STATUS.ACTIVE);

      // Verify inventory reduction
      const inventory = await PackageDateInventoryModel.findOne({
        package: individualPackage._id,
        date: '2024-04-15T00:00:00.000Z'
      });
      expect(inventory?.availableSeats).toBe(19);
    });

    test('should create family booking with multiple travelers', async () => {
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [
          {
            fullName: 'John Doe',
            age: 35,
            gender: 'male',
            idProof: 'PASS123456'
          },
          {
            fullName: 'Jane Doe',
            age: 32,
            gender: 'female',
            idProof: 'PASS789012'
          },
          {
            fullName: 'Mike Doe',
            age: 12,
            gender: 'male'
          },
          {
            fullName: 'Sarah Doe',
            age: 8,
            gender: 'female'
          }
        ]
      };

      const result = await BookingService.createBooking(testUser._id, payload);

      expect(result.booking.numberOfPeople).toBe(4);
      expect(result.booking.totalAmount).toBe(100000); // 4 × 25000
      expect(result.travelers).toHaveLength(4);

      // Verify inventory reduction
      const inventory = await PackageDateInventoryModel.findOne({
        package: individualPackage._id,
        date: '2024-04-15T00:00:00.000Z'
      });
      expect(inventory?.availableSeats).toBe(16);
    });

    test('should handle idempotency correctly', async () => {
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        idempotencyKey: 'test-idempotency-key-123',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      // First request
      const result1 = await BookingService.createBooking(testUser._id, payload);
      expect(result1.booking._id).toBeDefined();

      // Second request with same idempotency key
      const result2 = await BookingService.createBooking(testUser._id, payload);
      expect(result2.booking._id).toBe(result1.booking._id);

      // Verify only one booking was created
      const bookings = await BookingSummaryModel.find({ user: testUser._id });
      expect(bookings).toHaveLength(1);
    });
  });

  describe('Group Package Booking', () => {
    test('should create minimum group size booking', async () => {
      const travelers = Array(5).fill().map((_, i) => ({
        fullName: `Traveler ${i + 1}`,
        age: 25 + i,
        gender: i % 2 ? 'male' : 'female',
        idProof: `PASS${1000 + i}`
      }));

      const payload = {
        packageId: groupPackage._id,
        trekDate: '2024-05-01T00:00:00.000Z',
        travelers
      };

      const result = await BookingService.createBooking(testUser._id, payload);

      expect(result.booking.numberOfPeople).toBe(5);
      expect(result.booking.totalAmount).toBe(100000); // 5 × 20000
      expect(result.travelers).toHaveLength(5);

      // Verify inventory reduction
      const inventory = await PackageDateInventoryModel.findOne({
        package: groupPackage._id,
        date: '2024-05-01T00:00:00.000Z'
      });
      expect(inventory?.availableSeats).toBe(10);
    });

    test('should create maximum group size booking', async () => {
      const travelers = Array(15).fill().map((_, i) => ({
        fullName: `Traveler ${i + 1}`,
        age: 20 + i,
        gender: i % 2 ? 'male' : 'female',
        idProof: `PASS${2000 + i}`
      }));

      const payload = {
        packageId: groupPackage._id,
        trekDate: '2024-05-01T00:00:00.000Z',
        travelers
      };

      const result = await BookingService.createBooking(testUser._id, payload);

      expect(result.booking.numberOfPeople).toBe(15);
      expect(result.booking.totalAmount).toBe(300000); // 15 × 20000
      expect(result.travelers).toHaveLength(15);

      // Verify inventory is full
      const inventory = await PackageDateInventoryModel.findOne({
        package: groupPackage._id,
        date: '2024-05-01T00:00:00.000Z'
      });
      expect(inventory?.availableSeats).toBe(0);
    });
  });

  describe('Error Handling', () => {
    test('should reject booking with insufficient inventory', async () => {
      // Fill up inventory
      await PackageDateInventoryModel.updateOne(
        { package: individualPackage._id, date: '2024-04-15T00:00:00.000Z' },
        { availableSeats: 0 }
      );

      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      await expect(BookingService.createBooking(testUser._id, payload))
        .rejects.toThrow('Not enough seats available');
    });

    test('should reject booking for non-existent date', async () => {
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-12-25T00:00:00.000Z', // No inventory for this date
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      await expect(BookingService.createBooking(testUser._id, payload))
        .rejects.toThrow('trekDate is not available for this package');
    });

    test('should reject booking exceeding maximum travelers', async () => {
      const travelers = Array(21).fill().map((_, i) => ({
        fullName: `Traveler ${i + 1}`,
        age: 25,
        gender: 'male'
      }));

      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers
      };

      await expect(BookingService.createBooking(testUser._id, payload))
        .rejects.toThrow('Number of people must be between 1 and 20');
    });

    test('should reject booking for inactive package', async () => {
      await PackageModel.updateOne(
        { _id: individualPackage._id },
        { status: 'inactive' }
      );

      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      await expect(BookingService.createBooking(testUser._id, payload))
        .rejects.toThrow('Package is not active');
    });
  });

  describe('Booking Lifecycle', () => {
    test('should confirm booking successfully', async () => {
      // Create a booking first
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      const createdBooking = await BookingService.createBooking(testUser._id, payload);
      
      // Confirm the booking
      const confirmedBooking = await BookingService.confirmBooking(createdBooking.booking._id);

      expect(confirmedBooking.booking.bookingStatus).toBe(BOOKING_STATUS.CONFIRMED);
    });

    test('should cancel booking and restore inventory', async () => {
      // Create a booking first
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      const createdBooking = await BookingService.createBooking(testUser._id, payload);
      
      // Get initial inventory
      const initialInventory = await PackageDateInventoryModel.findOne({
        package: individualPackage._id,
        date: '2024-04-15T00:00:00.000Z'
      });

      // Cancel the booking
      const cancelledBooking = await BookingService.cancelBooking(
        createdBooking.booking._id,
        testUser._id,
        'user'
      );

      expect(cancelledBooking.booking.bookingStatus).toBe(BOOKING_STATUS.CANCELLED);
      expect(cancelledBooking.travelers[0].status).toBe(TRAVELER_STATUS.CANCELLED);

      // Verify inventory restoration
      const restoredInventory = await PackageDateInventoryModel.findOne({
        package: individualPackage._id,
        date: '2024-04-15T00:00:00.000Z'
      });
      expect(restoredInventory?.availableSeats).toBe(initialInventory?.availableSeats! + 1);
    });

    test('should prevent unauthorized booking cancellation', async () => {
      // Create booking with test user
      const payload = {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'John Doe',
          age: 30,
          gender: 'male'
        }]
      };

      const createdBooking = await BookingService.createBooking(testUser._id, payload);
      
      // Try to cancel with different user
      const otherUser = await createTestUser('user');
      
      await expect(BookingService.cancelBooking(
        createdBooking.booking._id,
        otherUser._id,
        'user'
      )).rejects.toThrow('You can only cancel your own bookings');
    });
  });

  describe('Query Operations', () => {
    test('should get user bookings with pagination', async () => {
      // Create multiple bookings
      for (let i = 0; i < 5; i++) {
        await BookingService.createBooking(testUser._id, {
          packageId: individualPackage._id,
          trekDate: '2024-04-15T00:00:00.000Z',
          travelers: [{
            fullName: `Traveler ${i}`,
            age: 30,
            gender: 'male'
          }]
        });
      }

      const result = await BookingService.getMyBookings(testUser._id, {
        page: 1,
        limit: 3
      });

      expect(result.data).toHaveLength(3);
      expect(result.meta.total).toBe(5);
      expect(result.meta.page).toBe(1);
      expect(result.meta.limit).toBe(3);
      expect(result.meta.pages).toBe(2);
    });

    test('should filter bookings by status', async () => {
      // Create bookings with different statuses
      const booking1 = await BookingService.createBooking(testUser._id, {
        packageId: individualPackage._id,
        trekDate: '2024-04-15T00:00:00.000Z',
        travelers: [{
          fullName: 'Traveler 1',
          age: 30,
          gender: 'male'
        }]
      });

      await BookingService.confirmBooking(booking1.booking._id);

      const booking2 = await BookingService.createBooking(testUser._id, {
        packageId: individualPackage._id,
        trekDate: '2024-04-16T00:00:00.000Z',
        travelers: [{
          fullName: 'Traveler 2',
          age: 30,
          gender: 'male'
        }]
      });

      const result = await BookingService.getMyBookings(testUser._id, {
        status: BOOKING_STATUS.CONFIRMED
      });

      expect(result.data).toHaveLength(1);
      expect(result.data[0].bookingStatus).toBe(BOOKING_STATUS.CONFIRMED);
    });
  });

  // Helper functions
  async function createTestUser(role: string) {
    // Implementation would create a test user in the database
    return {
      _id: new mongoose.Types.ObjectId(),
      email: `test${role}@example.com`,
      role
    };
  }

  function generateJWT(user: any): string {
    // Implementation would generate a JWT token
    return 'mock-jwt-token';
  }

  async function createTestPackage(packageData: any) {
    const packageDoc = new PackageModel({
      ...packageData,
      status: 'active'
    });
    return await packageDoc.save();
  }

  async function createTestInventory(packageId: string, date: string, seats: number) {
    const inventory = new PackageDateInventoryModel({
      package: packageId,
      date: new Date(date),
      availableSeats: seats,
      totalSeats: seats
    });
    return await inventory.save();
  }

  async function cleanupTestData() {
    await BookingSummaryModel.deleteMany({});
    await TravelerModel.deleteMany({});
    await PackageDateInventoryModel.deleteMany({});
    await PackageModel.deleteMany({});
  }
});
