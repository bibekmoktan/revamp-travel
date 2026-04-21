import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { env } from '../config/env';
import { logger } from './logger';

cloudinary.config({
  cloud_name: env.cloudinary.cloudName,
  api_key: env.cloudinary.apiKey,
  api_secret: env.cloudinary.apiSecret,
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadPath = path.join(process.cwd(), 'uploads');
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath, { recursive: true });
    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  },
});

export const upload = multer({ storage });

const removeTempFile = (filePath: string) => {
  try {
    fs.unlinkSync(filePath);
  } catch (err: any) {
    logger.warn(`Failed to remove temp file: ${filePath}`, { error: err.message });
  }
};

export const sendToCloudinary = async (filePath: string, folder: string) => {
  try {
    const result = await cloudinary.uploader.upload(filePath, {
      folder: `travel-nepal/${folder}`,
      resource_type: 'auto',
      fetch_format: 'auto',
      quality: 'auto',
    });
    removeTempFile(filePath);
    return result;
  } catch (error: any) {
    removeTempFile(filePath);
    throw new Error('Cloudinary upload failed');
  }
};