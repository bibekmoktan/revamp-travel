"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendResponse = void 0;
const sendResponse = (res, payload) => {
    res.status(payload.statusCode).json({
        success: payload.success,
        message: payload.message,
        meta: payload.meta,
        data: payload.data,
    });
};
exports.sendResponse = sendResponse;
