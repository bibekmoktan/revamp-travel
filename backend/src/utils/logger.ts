import { Request } from 'express';

export enum LogLevel {
  ERROR = 'ERROR',
  WARN = 'WARN',
  INFO = 'INFO',
  DEBUG = 'DEBUG',
}

export interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  requestId?: string;
  userId?: string;
  user?: string;
  bookingId?: string;
  reviewId?: string;
  groupId?: string;
  email?: string;
  role?: string;
  tokenType?: string;
  count?: number;
  total?: number;
  page?: number;
  limit?: number;
  port?: number;
  nodeEnv?: string;
  filters?: any;
  updatedFields?: string[];
  packageId?: string;
  package?: string;
  slug?: string;
  title?: string;
  category?: string;
  price?: number;
  payload?: any;
  status?: string;
  newSlug?: string;
  query?: any;
  text?: string;
  originalText?: string;
  baseSlug?: string;
  finalSlug?: string;
  attempts?: number;
  method?: string;
  url?: string;
  statusCode?: number;
  duration?: number;
  error?: any;
  stack?: string;
  reviewOwner?: string;
  userRole?: string;
  adminId?: string;
  isVerified?: boolean;
  rating?: number;
}

class Logger {
  private log(level: LogLevel, message: string, meta: Partial<LogEntry> = {}) {
    const logEntry: LogEntry = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...meta,
    };

    if (process.env.NODE_ENV === 'production') {
      const output = JSON.stringify(logEntry);
      if (level === LogLevel.ERROR || level === LogLevel.WARN) {
        process.stderr.write(output + '\n');
      } else {
        process.stdout.write(output + '\n');
      }
    } else {
      const colorMap = {
        [LogLevel.ERROR]: '\x1b[31m',
        [LogLevel.WARN]: '\x1b[33m',
        [LogLevel.INFO]: '\x1b[36m',
        [LogLevel.DEBUG]: '\x1b[37m',
      };
      const reset = '\x1b[0m';
      const requestTag = meta.requestId ? ` [${meta.requestId}]` : '';
      const errorLine = meta.error ? `\n  ${meta.error}` : '';
      console.log(
        `${colorMap[level]}[${level}]${reset} ${logEntry.timestamp} - ${message}${requestTag}${errorLine}`
      );
    }
  }

  error(message: string, meta: Partial<LogEntry> = {}) {
    this.log(LogLevel.ERROR, message, meta);
  }

  warn(message: string, meta: Partial<LogEntry> = {}) {
    this.log(LogLevel.WARN, message, meta);
  }

  info(message: string, meta: Partial<LogEntry> = {}) {
    this.log(LogLevel.INFO, message, meta);
  }

  debug(message: string, meta: Partial<LogEntry> = {}) {
    this.log(LogLevel.DEBUG, message, meta);
  }

  // Log request information
  logRequest(req: Request, statusCode: number, duration: number) {
    this.info('HTTP Request', {
      method: req.method,
      url: req.url,
      statusCode,
      duration,
      requestId: req.headers['x-request-id'] as string,
      userId: req.user?.id,
    });
  }
}

export const logger = new Logger();
