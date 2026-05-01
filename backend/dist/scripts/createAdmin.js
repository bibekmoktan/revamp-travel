"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config({ path: path_1.default.resolve(__dirname, '../../.env') });
const MONGO_URL = process.env.MONGO_URL;
const EMAIL = 'admin@travelnepal.com';
const PASSWORD = 'Admin@Nepal2025';
const NAME = 'Super Admin';
async function createAdmin() {
    await mongoose_1.default.connect(MONGO_URL);
    console.log('Connected to MongoDB');
    const db = mongoose_1.default.connection.db;
    const users = db.collection('users');
    const existing = await users.findOne({ email: EMAIL });
    if (existing) {
        console.log('Admin user already exists:', EMAIL);
        await mongoose_1.default.disconnect();
        return;
    }
    const hashed = await bcrypt_1.default.hash(PASSWORD, 12);
    await users.insertOne({
        name: NAME,
        email: EMAIL,
        password: hashed,
        role: 'admin',
        isBlocked: false,
        createdAt: new Date(),
        updatedAt: new Date(),
    });
    console.log('✅ Admin user created successfully');
    console.log('   Email:   ', EMAIL);
    console.log('   Password:', PASSWORD);
    await mongoose_1.default.disconnect();
}
createAdmin().catch((err) => {
    console.error('Error:', err);
    process.exit(1);
});
