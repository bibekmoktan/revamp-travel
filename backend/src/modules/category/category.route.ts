import { Router } from 'express';
import * as CategoryController from './category.controller';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Public
router.get('/',          CategoryController.getAllCategories);
router.get('/:slug',     CategoryController.getCategoryBySlug);

// Admin only
router.post('/',         protect, authorize('admin'), ...CategoryController.createCategory);
router.patch('/:id',     protect, authorize('admin'), ...CategoryController.updateCategory);
router.delete('/:id',    protect, authorize('admin'), CategoryController.deleteCategory);

export const CategoryRoutes = router;
