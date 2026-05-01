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
exports.ReviewModel = void 0;
const mongoose_1 = __importStar(require("mongoose"));
const reviewSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    package: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Package',
        required: true,
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    },
    comment: {
        type: String,
        required: true,
        trim: true,
        minlength: 10,
        maxlength: 2000,
    },
    title: {
        type: String,
        trim: true,
        maxlength: 200,
    },
    isVerified: {
        type: Boolean,
        default: false,
    },
    helpfulCount: {
        type: Number,
        default: 0,
        min: 0,
    },
    response: {
        text: {
            type: String,
            trim: true,
            maxlength: 1000,
        },
        respondedAt: {
            type: Date,
        },
        respondedBy: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'User',
        },
    },
}, {
    timestamps: true,
});
// Indexes for performance
reviewSchema.index({ package: 1, createdAt: -1 });
reviewSchema.index({ user: 1, package: 1 }, { unique: true });
reviewSchema.index({ rating: 1 });
reviewSchema.index({ isVerified: 1 });
// Pre-save middleware to validate rating
reviewSchema.pre('save', function (next) {
    if (this.rating < 1 || this.rating > 5) {
        return next(new Error('Rating must be between 1 and 5'));
    }
    next();
});
exports.ReviewModel = mongoose_1.default.model('Review', reviewSchema);
