import cors from 'cors';
import { env } from './env';

export const corsOptions = cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);

    if (env.nodeEnv === 'development') {
      return callback(null, true);
    }

    const allowedOrigins = (process.env.ALLOWED_ORIGINS ?? '')
      .split(',')
      .map((o) => o.trim().replace(/\/$/, ''));

    const normalised = origin.replace(/\/$/, '');

    if (allowedOrigins.includes(normalised)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin "${origin}" not allowed`));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  exposedHeaders: ['X-Total-Count'],
});
