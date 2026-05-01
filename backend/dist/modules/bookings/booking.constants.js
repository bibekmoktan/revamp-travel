"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TRAVELER_STATUS = exports.PAYMENT_STATUS = exports.BOOKING_STATUS = exports.BOOKING_CONSTANTS = void 0;
exports.BOOKING_CONSTANTS = {
    BOOKING_EXPIRY_MINUTES: 15,
    MIN_TRAVELERS: 1,
    MAX_TRAVELERS: 20,
    DEFAULT_PAGE: 1,
    DEFAULT_LIMIT: 10,
};
exports.BOOKING_STATUS = {
    RESERVED: 'reserved',
    CONFIRMED: 'confirmed',
    CANCELLED: 'cancelled',
};
exports.PAYMENT_STATUS = {
    PENDING: 'pending',
    PAID: 'paid',
    FAILED: 'failed',
};
exports.TRAVELER_STATUS = {
    ACTIVE: 'active',
    CANCELLED: 'cancelled',
};
