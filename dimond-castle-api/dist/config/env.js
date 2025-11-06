"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.env = {
    NODE_ENV: process.env.NODE_ENV || 'development',
    PORT: Number(process.env.PORT || 4000),
    MONGODB_URI: process.env.MONGODB_URI || '',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN || '*',
    CLOUDINARY_URL: process.env.CLOUDINARY_URL || '',
    CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
    CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
    CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',
};
if (!exports.env.MONGODB_URI) {
    // eslint-disable-next-line no-console
    console.warn('[env] MONGODB_URI is not set. API will fail to connect to DB.');
}
if (!exports.env.CLOUDINARY_URL && (!exports.env.CLOUDINARY_CLOUD_NAME || !exports.env.CLOUDINARY_API_KEY || !exports.env.CLOUDINARY_API_SECRET)) {
    // eslint-disable-next-line no-console
    console.warn('[env] Cloudinary credentials are not set. Media endpoints will not work.');
}
