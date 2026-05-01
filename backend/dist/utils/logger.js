"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = exports.LogLevel = void 0;
var LogLevel;
(function (LogLevel) {
    LogLevel["ERROR"] = "ERROR";
    LogLevel["WARN"] = "WARN";
    LogLevel["INFO"] = "INFO";
    LogLevel["DEBUG"] = "DEBUG";
})(LogLevel || (exports.LogLevel = LogLevel = {}));
class Logger {
    log(level, message, meta = {}) {
        const logEntry = {
            timestamp: new Date().toISOString(),
            level,
            message,
            ...meta,
        };
        if (process.env.NODE_ENV === 'production') {
            const output = JSON.stringify(logEntry);
            if (level === LogLevel.ERROR || level === LogLevel.WARN) {
                process.stderr.write(output + '\n');
            }
            else {
                process.stdout.write(output + '\n');
            }
        }
        else {
            const colorMap = {
                [LogLevel.ERROR]: '\x1b[31m',
                [LogLevel.WARN]: '\x1b[33m',
                [LogLevel.INFO]: '\x1b[36m',
                [LogLevel.DEBUG]: '\x1b[37m',
            };
            const reset = '\x1b[0m';
            const requestTag = meta.requestId ? ` [${meta.requestId}]` : '';
            const errorLine = meta.error ? `\n  ${meta.error}` : '';
            console.log(`${colorMap[level]}[${level}]${reset} ${logEntry.timestamp} - ${message}${requestTag}${errorLine}`);
        }
    }
    error(message, meta = {}) {
        this.log(LogLevel.ERROR, message, meta);
    }
    warn(message, meta = {}) {
        this.log(LogLevel.WARN, message, meta);
    }
    info(message, meta = {}) {
        this.log(LogLevel.INFO, message, meta);
    }
    debug(message, meta = {}) {
        this.log(LogLevel.DEBUG, message, meta);
    }
    // Log request information
    logRequest(req, statusCode, duration) {
        this.info('HTTP Request', {
            method: req.method,
            url: req.url,
            statusCode,
            duration,
            requestId: req.headers['x-request-id'],
            userId: req.user?.id,
        });
    }
}
exports.logger = new Logger();
