import { CategoryModel } from './category.model';
import { ICategory } from './category.interface';
import { NotFoundError, ConflictError } from '../../utils/errors';
import { logger } from '../../utils/logger';

function toSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const CategoryService = {
  async createCategory(payload: Partial<ICategory>) {
    if (!payload.slug) {
      payload.slug = toSlug(payload.name!);
    }

    const existing = await CategoryModel.findOne({ slug: payload.slug });
    if (existing) throw new ConflictError('Category with this slug already exists');

    const category = await CategoryModel.create(payload);
    logger.info('Category created', { id: category._id, slug: category.slug });
    return category;
  },

  async getAllCategories(onlyActive = false) {
    const filter = onlyActive ? { isActive: true } : {};
    return CategoryModel.find(filter).sort({ order: 1, name: 1 }).lean();
  },

  async getCategoryBySlug(slug: string) {
    const category = await CategoryModel.findOne({ slug }).lean();
    if (!category) throw new NotFoundError('Category not found');
    return category;
  },

  async updateCategory(id: string, payload: Partial<ICategory>) {
    const category = await CategoryModel.findByIdAndUpdate(id, payload, { new: true, runValidators: true });
    if (!category) throw new NotFoundError('Category not found');
    logger.info('Category updated', { id });
    return category;
  },

  async deleteCategory(id: string) {
    const category = await CategoryModel.findByIdAndDelete(id);
    if (!category) throw new NotFoundError('Category not found');
    logger.info('Category deleted', { id });
    return category;
  },
};
