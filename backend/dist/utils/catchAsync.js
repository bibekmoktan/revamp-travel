"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTimeout = exports.catchAsync = void 0;
const catchAsync = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
exports.catchAsync = catchAsync;
const withTimeout = (promise, ms, message = "Operation timed out") => Promise.race([
    promise,
    new Promise((_, reject) => setTimeout(() => reject(new Error(message)), ms)),
]);
exports.withTimeout = withTimeout;
