"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.BookingSummaryModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const bookingSummarySchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    package: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Package', required: true, index: true },
    trekDate: { type: Date, required: true, index: true },
    idempotencyKey: { type: String, trim: true, maxlength: 200 },
    numberOfPeople: { type: Number, required: true, min: 1 },
    totalAmount: { type: Number, required: true, min: 0 },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed'],
        default: 'pending',
        index: true,
    },
    bookingStatus: {
        type: String,
        enum: ['reserved', 'confirmed', 'cancelled'],
        default: 'reserved',
        index: true,
    },
    expiresAt: { type: Date, required: true },
}, { timestamps: true });
bookingSummarySchema.index({ user: 1, package: 1, trekDate: 1 });
bookingSummarySchema.index({ user: 1, idempotencyKey: 1 }, {
    unique: true,
    partialFilterExpression: {
        idempotencyKey: { $type: 'string' },
    },
});
// Performance optimization indexes
bookingSummarySchema.index({ bookingStatus: 1, expiresAt: 1 }); // For expiration cleanup
bookingSummarySchema.index({ user: 1, bookingStatus: 1, createdAt: -1 }); // For user booking lists
bookingSummarySchema.index({ package: 1, trekDate: 1, bookingStatus: 1 }); // For package availability
bookingSummarySchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 }); // Auto-expire documents
bookingSummarySchema.index({ paymentStatus: 1, bookingStatus: 1 }); // For payment queries
exports.BookingSummaryModel = mongoose_1.default.model('BookingSummary', bookingSummarySchema);
