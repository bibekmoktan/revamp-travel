"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateSlug = exports.generateUniqueSlug = exports.generateSlug = void 0;
const logger_1 = require("./logger");
/**
 * Generate a URL-friendly slug from a string
 */
const generateSlug = (text) => {
    try {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/\s+/g, '-') // Replace spaces with -
            .replace(/[^\w\-]+/g, '') // Remove all non-word chars
            .replace(/\-\-+/g, '-') // Replace multiple - with single -
            .replace(/^-+/, '') // Trim - from start of text
            .replace(/-+$/, ''); // Trim - from end of text
    }
    catch (error) {
        logger_1.logger.error('Failed to generate slug', { text, error: error.message });
        throw new Error('Slug generation failed');
    }
};
exports.generateSlug = generateSlug;
/**
 * Generate a unique slug by checking for duplicates
 */
const generateUniqueSlug = async (text, model, additionalCheck) => {
    try {
        let baseSlug = (0, exports.generateSlug)(text);
        let uniqueSlug = baseSlug;
        let counter = 1;
        // Check if slug exists
        while (true) {
            const query = { slug: uniqueSlug };
            if (additionalCheck) {
                Object.assign(query, additionalCheck);
            }
            const existing = await model.findOne(query);
            if (!existing) {
                break;
            }
            uniqueSlug = `${baseSlug}-${counter}`;
            counter++;
        }
        logger_1.logger.info('Generated unique slug', {
            originalText: text,
            baseSlug,
            finalSlug: uniqueSlug,
            attempts: counter
        });
        return uniqueSlug;
    }
    catch (error) {
        logger_1.logger.error('Failed to generate unique slug', {
            text,
            error: error.message
        });
        throw new Error('Unique slug generation failed');
    }
};
exports.generateUniqueSlug = generateUniqueSlug;
/**
 * Validate slug format
 */
const validateSlug = (slug) => {
    const slugRegex = /^[a-z0-9-]+$/;
    return slugRegex.test(slug) && slug.length >= 3 && slug.length <= 100;
};
exports.validateSlug = validateSlug;
