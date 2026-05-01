"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PackageService = void 0;
const package_model_1 = require("./package.model");
const errors_1 = require("../../utils/errors");
const logger_1 = require("../../utils/logger");
const slugGenerator_1 = require("../../utils/slugGenerator");
exports.PackageService = {
    async createPackage(payload) {
        try {
            // Generate unique slug if not provided
            if (!payload.slug) {
                payload.slug = await (0, slugGenerator_1.generateUniqueSlug)(payload.title, package_model_1.PackageModel);
            }
            else {
                // Check if provided slug already exists
                const existingPackage = await package_model_1.PackageModel.findOne({ slug: payload.slug });
                if (existingPackage) {
                    logger_1.logger.warn('Attempt to create package with existing slug', { slug: payload.slug });
                    throw new errors_1.ConflictError('Package with this slug already exists');
                }
            }
            const result = await package_model_1.PackageModel.create(payload);
            logger_1.logger.info('Package created successfully', {
                packageId: result._id.toString(),
                slug: result.slug,
                title: result.title,
                category: result.category,
                price: result.price
            });
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.ConflictError) {
                throw error;
            }
            logger_1.logger.error('Failed to create package', {
                slug: payload.slug,
                title: payload.title,
                error: error.message
            });
            throw new Error('Package creation failed');
        }
    },
    async getAllPackages(query) {
        try {
            const { searchTerm, category, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status, difficulty, duration, season } = query;
            const filter = {};
            // Build filter
            if (searchTerm) {
                const escapedTerm = String(searchTerm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                filter.$or = [
                    { title: { $regex: escapedTerm, $options: "i" } },
                    { location: { $regex: escapedTerm, $options: "i" } },
                    { description: { $regex: escapedTerm, $options: "i" } }
                ];
            }
            if (category)
                filter.category = category;
            if (status)
                filter.status = status;
            if (difficulty)
                filter.difficulty = difficulty;
            if (season)
                filter.bestSeason = { $elemMatch: { $regex: new RegExp(season, 'i') } };
            if (duration) {
                const ranges = {
                    '1': { min: 1, max: 1 },
                    '2-3': { min: 2, max: 3 },
                    '4-7': { min: 4, max: 7 },
                    '8+': { min: 8 },
                };
                const range = ranges[duration];
                if (range) {
                    // Extract leading integer from duration string e.g. "7 Days" → 7
                    const numDays = {
                        $convert: {
                            input: { $arrayElemAt: [{ $split: ['$duration', ' '] }, 0] },
                            to: 'int',
                            onError: 0,
                            onNull: 0,
                        },
                    };
                    const conds = [{ $gte: [numDays, range.min] }];
                    if (range.max !== undefined)
                        conds.push({ $lte: [numDays, range.max] });
                    filter.$expr = { $and: conds };
                }
            }
            if (minPrice || maxPrice) {
                filter.price = {};
                if (minPrice)
                    filter.price.$gte = Number(minPrice);
                if (maxPrice)
                    filter.price.$lte = Number(maxPrice);
            }
            // Build sort
            const sort = {};
            sort[sortBy] = sortOrder === 'desc' ? -1 : 1;
            const clampedLimit = Math.min(Number(limit), 100);
            const skip = (Number(page) - 1) * clampedLimit;
            const [data, total] = await Promise.all([
                package_model_1.PackageModel.find(filter)
                    .sort(sort)
                    .skip(skip)
                    .limit(clampedLimit)
                    .lean(),
                package_model_1.PackageModel.countDocuments(filter)
            ]);
            logger_1.logger.info('Retrieved packages list', {
                count: data.length,
                total,
                page: Number(page),
                limit: Number(limit),
                filters: { searchTerm, category, minPrice, maxPrice, status }
            });
            return {
                data,
                meta: {
                    total,
                    page: Number(page),
                    limit: clampedLimit,
                    pages: Math.ceil(total / clampedLimit),
                },
            };
        }
        catch (error) {
            logger_1.logger.error('Failed to get packages', {
                query,
                error: error.message
            });
            throw new Error('Failed to retrieve packages');
        }
    },
    async getPackageBySlug(slug) {
        try {
            const result = await package_model_1.PackageModel.findOne({ slug }).lean();
            if (!result) {
                logger_1.logger.warn('Attempt to get non-existent package by slug', { slug });
                throw new errors_1.NotFoundError("Package not found");
            }
            logger_1.logger.info('Package retrieved successfully', {
                packageId: result._id.toString(),
                slug: result.slug,
                title: result.title
            });
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to get package by slug', {
                slug,
                error: error.message
            });
            throw new Error('Failed to retrieve package');
        }
    },
    async getPackageById(id) {
        try {
            const result = await package_model_1.PackageModel.findById(id).lean();
            if (!result) {
                logger_1.logger.warn('Attempt to get non-existent package by ID', { packageId: id });
                throw new errors_1.NotFoundError("Package not found");
            }
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to get package by ID', {
                packageId: id,
                error: error.message
            });
            throw new Error('Failed to retrieve package');
        }
    },
    async updatePackage(id, payload) {
        try {
            // Check if package exists
            const existingPackage = await package_model_1.PackageModel.findById(id);
            if (!existingPackage) {
                logger_1.logger.warn('Attempt to update non-existent package', { packageId: id });
                throw new errors_1.NotFoundError("Package not found");
            }
            // Handle slug update
            if (payload.slug && payload.slug !== existingPackage.slug) {
                // Check if new slug conflicts with existing package
                const slugConflict = await package_model_1.PackageModel.findOne({ slug: payload.slug });
                if (slugConflict) {
                    logger_1.logger.warn('Attempt to update package with conflicting slug', {
                        packageId: id,
                        newSlug: payload.slug
                    });
                    throw new errors_1.ConflictError('Package with this slug already exists');
                }
            }
            else if (payload.title && payload.title !== existingPackage.title && !payload.slug) {
                // Generate new slug if title changed and no new slug provided
                payload.slug = await (0, slugGenerator_1.generateUniqueSlug)(payload.title, package_model_1.PackageModel, { _id: { $ne: id } });
            }
            const result = await package_model_1.PackageModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true }).lean();
            logger_1.logger.info('Package updated successfully', {
                packageId: id,
                slug: result?.slug,
                updatedFields: Object.keys(payload)
            });
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError || error instanceof errors_1.ConflictError) {
                throw error;
            }
            logger_1.logger.error('Failed to update package', {
                packageId: id,
                payload,
                error: error.message
            });
            throw new Error('Failed to update package');
        }
    },
    async deletePackage(id) {
        try {
            const packageToDelete = await package_model_1.PackageModel.findById(id);
            if (!packageToDelete) {
                logger_1.logger.warn('Attempt to delete non-existent package', { packageId: id });
                throw new errors_1.NotFoundError("Package not found");
            }
            await package_model_1.PackageModel.findByIdAndDelete(id);
            logger_1.logger.info('Package deleted successfully', {
                packageId: id,
                slug: packageToDelete.slug,
                title: packageToDelete.title
            });
            return { message: 'Package deleted successfully' };
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to delete package', {
                packageId: id,
                error: error.message
            });
            throw new Error('Failed to delete package');
        }
    },
    async updatePackageStatus(id, status) {
        try {
            const result = await package_model_1.PackageModel.findByIdAndUpdate(id, { status }, { new: true, runValidators: true }).lean();
            if (!result) {
                logger_1.logger.warn('Attempt to update status of non-existent package', { packageId: id });
                throw new errors_1.NotFoundError("Package not found");
            }
            logger_1.logger.info('Package status updated successfully', {
                packageId: id,
                status
            });
            return result;
        }
        catch (error) {
            if (error instanceof errors_1.NotFoundError) {
                throw error;
            }
            logger_1.logger.error('Failed to update package status', {
                packageId: id,
                status,
                error: error.message
            });
            throw new Error('Failed to update package status');
        }
    }
};
