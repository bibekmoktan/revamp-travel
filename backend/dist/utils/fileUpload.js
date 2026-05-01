"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendToCloudinary = exports.upload = void 0;
const cloudinary_1 = require("cloudinary");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
cloudinary_1.v2.config({
    cloud_name: env_1.env.cloudinary.cloudName,
    api_key: env_1.env.cloudinary.apiKey,
    api_secret: env_1.env.cloudinary.apiSecret,
});
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const uploadPath = path_1.default.join(process.cwd(), 'uploads');
        if (!fs_1.default.existsSync(uploadPath))
            fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    },
});
exports.upload = (0, multer_1.default)({ storage });
const removeTempFile = (filePath) => {
    try {
        fs_1.default.unlinkSync(filePath);
    }
    catch (err) {
        logger_1.logger.warn(`Failed to remove temp file: ${filePath}`, { error: err.message });
    }
};
const sendToCloudinary = async (filePath, folder) => {
    try {
        const result = await cloudinary_1.v2.uploader.upload(filePath, {
            folder: `travel-nepal/${folder}`,
            resource_type: 'auto',
            fetch_format: 'auto',
            quality: 'auto',
        });
        removeTempFile(filePath);
        return result;
    }
    catch (error) {
        removeTempFile(filePath);
        throw new Error('Cloudinary upload failed');
    }
};
exports.sendToCloudinary = sendToCloudinary;
