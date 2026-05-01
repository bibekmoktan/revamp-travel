"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_1 = require("../config/env");
const logger_1 = require("./logger");
const sendEmail = async (options) => {
    if (!env_1.env.email.host || !env_1.env.email.user || !env_1.env.email.pass) {
        logger_1.logger.warn(`Email not configured — skipping send to ${options.to}: ${options.subject}`);
        return;
    }
    const transporter = nodemailer_1.default.createTransport({
        host: env_1.env.email.host,
        port: env_1.env.email.port ?? 587,
        secure: (env_1.env.email.port ?? 587) === 465,
        auth: {
            user: env_1.env.email.user,
            pass: env_1.env.email.pass,
        },
    });
    await transporter.sendMail({
        from: `"Travel Nepal" <${env_1.env.email.user}>`,
        to: options.to,
        subject: options.subject,
        html: options.html,
    });
    logger_1.logger.info(`Email sent to ${options.to}: ${options.subject}`);
};
exports.sendEmail = sendEmail;
