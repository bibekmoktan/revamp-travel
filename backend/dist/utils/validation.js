"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateBody = exports.validate = void 0;
const zod_1 = require("zod");
const validate = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: [{ field: 'unknown', message: 'Unknown validation error' }],
                });
            }
        }
    };
};
exports.validate = validate;
const validateBody = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        }
        catch (error) {
            if (error instanceof zod_1.ZodError) {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: error.errors.map((err) => ({
                        field: err.path.join('.'),
                        message: err.message,
                    })),
                });
            }
            else {
                res.status(400).json({
                    success: false,
                    message: 'Validation failed',
                    errors: [{ field: 'unknown', message: 'Unknown validation error' }],
                });
            }
        }
    };
};
exports.validateBody = validateBody;
