import { PackageModel } from "./package.model";
import { IPackage } from "./package.interface";
import { NotFoundError, ConflictError, ValidationError } from "../../utils/errors";
import { logger } from "../../utils/logger";
import { generateUniqueSlug } from "../../utils/slugGenerator";

export const PackageService = {
  async createPackage(payload: IPackage) {
    try {
      // Generate unique slug if not provided
      if (!payload.slug) {
        payload.slug = await generateUniqueSlug(payload.title, PackageModel);
      } else {
        // Check if provided slug already exists
        const existingPackage = await PackageModel.findOne({ slug: payload.slug });
        if (existingPackage) {
          logger.warn('Attempt to create package with existing slug', { slug: payload.slug });
          throw new ConflictError('Package with this slug already exists');
        }
      }

      const result = await PackageModel.create(payload);

      logger.info('Package created successfully', {
        packageId: result._id.toString(),
        slug: result.slug,
        title: result.title,
        category: result.category,
        price: result.price
      });

      return result;
    } catch (error: any) {
      if (error instanceof ConflictError) {
        throw error;
      }

      logger.error('Failed to create package', {
        slug: payload.slug,
        title: payload.title,
        error: error.message
      });
      throw new Error('Package creation failed');
    }
  },

  async getAllPackages(query: Record<string, any>) {
    try {
      const { searchTerm, category, minPrice, maxPrice, page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc', status } = query;
      const filter: any = {};

      // Build filter
      if (searchTerm) {
        const escapedTerm = String(searchTerm).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        filter.$or = [
          { title: { $regex: escapedTerm, $options: "i" } },
          { location: { $regex: escapedTerm, $options: "i" } },
          { description: { $regex: escapedTerm, $options: "i" } }
        ];
      }
      if (category) filter.category = category;
      if (status) filter.status = status;
      if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      // Build sort
      const sort: any = {};
      sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

      const clampedLimit = Math.min(Number(limit), 100);
      const skip = (Number(page) - 1) * clampedLimit;

      const [data, total] = await Promise.all([
        PackageModel.find(filter)
          .sort(sort)
          .skip(skip)
          .limit(clampedLimit)
          .lean(),
        PackageModel.countDocuments(filter)
      ]);

      logger.info('Retrieved packages list', {
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
    } catch (error: any) {
      logger.error('Failed to get packages', {
        query,
        error: error.message
      });
      throw new Error('Failed to retrieve packages');
    }
  },

  async getPackageBySlug(slug: string) {
    try {
      const result = await PackageModel.findOne({ slug }).lean();
      
      if (!result) {
        logger.warn('Attempt to get non-existent package by slug', { slug });
        throw new NotFoundError("Package not found");
      }

      logger.info('Package retrieved successfully', {
        packageId: result._id.toString(),
        slug: result.slug,
        title: result.title
      });

      return result;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get package by slug', {
        slug,
        error: error.message
      });
      throw new Error('Failed to retrieve package');
    }
  },

  async getPackageById(id: string) {
    try {
      const result = await PackageModel.findById(id).lean();
      
      if (!result) {
        logger.warn('Attempt to get non-existent package by ID', { packageId: id });
        throw new NotFoundError("Package not found");
      }

      return result;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to get package by ID', {
        packageId: id,
        error: error.message
      });
      throw new Error('Failed to retrieve package');
    }
  },

  async updatePackage(id: string, payload: Partial<IPackage>) {
    try {
      // Check if package exists
      const existingPackage = await PackageModel.findById(id);
      if (!existingPackage) {
        logger.warn('Attempt to update non-existent package', { packageId: id });
        throw new NotFoundError("Package not found");
      }

      // Handle slug update
      if (payload.slug && payload.slug !== existingPackage.slug) {
        // Check if new slug conflicts with existing package
        const slugConflict = await PackageModel.findOne({ slug: payload.slug });
        if (slugConflict) {
          logger.warn('Attempt to update package with conflicting slug', {
            packageId: id,
            newSlug: payload.slug
          });
          throw new ConflictError('Package with this slug already exists');
        }
      } else if (payload.title && payload.title !== existingPackage.title && !payload.slug) {
        // Generate new slug if title changed and no new slug provided
        payload.slug = await generateUniqueSlug(payload.title, PackageModel, { _id: { $ne: id } });
      }

      const result = await PackageModel.findByIdAndUpdate(
        id, 
        payload, 
        { new: true, runValidators: true }
      ).lean();

      logger.info('Package updated successfully', {
        packageId: id,
        slug: result?.slug,
        updatedFields: Object.keys(payload)
      });

      return result;
    } catch (error: any) {
      if (error instanceof NotFoundError || error instanceof ConflictError) {
        throw error;
      }

      logger.error('Failed to update package', {
        packageId: id,
        payload,
        error: error.message
      });
      throw new Error('Failed to update package');
    }
  },

  async deletePackage(id: string) {
    try {
      const packageToDelete = await PackageModel.findById(id);
      if (!packageToDelete) {
        logger.warn('Attempt to delete non-existent package', { packageId: id });
        throw new NotFoundError("Package not found");
      }

      await PackageModel.findByIdAndDelete(id);

      logger.info('Package deleted successfully', {
        packageId: id,
        slug: packageToDelete.slug,
        title: packageToDelete.title
      });

      return { message: 'Package deleted successfully' };
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to delete package', {
        packageId: id,
        error: error.message
      });
      throw new Error('Failed to delete package');
    }
  },

  async updatePackageStatus(id: string, status: 'active' | 'inactive') {
    try {
      const result = await PackageModel.findByIdAndUpdate(
        id,
        { status },
        { new: true, runValidators: true }
      ).lean();

      if (!result) {
        logger.warn('Attempt to update status of non-existent package', { packageId: id });
        throw new NotFoundError("Package not found");
      }

      logger.info('Package status updated successfully', {
        packageId: id,
        status
      });

      return result;
    } catch (error: any) {
      if (error instanceof NotFoundError) {
        throw error;
      }

      logger.error('Failed to update package status', {
        packageId: id,
        status,
        error: error.message
      });
      throw new Error('Failed to update package status');
    }
  }
};