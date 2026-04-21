import nodemailer from 'nodemailer';
import { env } from '../config/env';
import { logger } from './logger';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendEmail = async (options: EmailOptions): Promise<void> => {
  if (!env.email.host || !env.email.user || !env.email.pass) {
    logger.warn(`Email not configured — skipping send to ${options.to}: ${options.subject}`);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: env.email.host,
    port: env.email.port ?? 587,
    secure: (env.email.port ?? 587) === 465,
    auth: {
      user: env.email.user,
      pass: env.email.pass,
    },
  });

  await transporter.sendMail({
    from: `"Travel Nepal" <${env.email.user}>`,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });

  logger.info(`Email sent to ${options.to}: ${options.subject}`);
};
