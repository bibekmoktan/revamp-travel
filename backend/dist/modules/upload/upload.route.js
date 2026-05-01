"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadRoutes = void 0;
const express_1 = require("express");
const fileUpload_1 = require("../../utils/fileUpload");
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
const catchAsync_1 = require("../../utils/catchAsync");
const router = (0, express_1.Router)();
router.post('/', protect_1.protect, (0, authorize_1.authorize)('admin'), fileUpload_1.upload.single('file'), (0, catchAsync_1.catchAsync)(async (req, res) => {
    if (!req.file) {
        res.status(400).json({ success: false, message: 'No file provided' });
        return;
    }
    const result = await (0, fileUpload_1.sendToCloudinary)(req.file.path, 'packages');
    res.status(200).json({
        success: true,
        message: 'File uploaded successfully',
        data: { url: result.secure_url, public_id: result.public_id },
    });
}));
exports.UploadRoutes = router;
