export const BOOKING_CONSTANTS = {
  BOOKING_EXPIRY_MINUTES: 15,
  MIN_TRAVELERS: 1,
  MAX_TRAVELERS: 20,
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
} as const;

export const BOOKING_STATUS = {
  RESERVED: 'reserved',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  PAID: 'paid',
  FAILED: 'failed',
} as const;

export const TRAVELER_STATUS = {
  ACTIVE: 'active',
  CANCELLED: 'cancelled',
} as const;
