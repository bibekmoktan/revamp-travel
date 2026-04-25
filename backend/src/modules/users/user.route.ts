import { Router } from 'express';
import { UserControllers } from './user.controller';
import { protect } from '../../middlewares/protect';
import { authorize } from '../../middlewares/authorize';

const router = Router();

// Admin-only routes
router.post('/', protect, authorize('admin'), ...UserControllers.createUser);
router.get('/', protect, authorize('admin'), ...UserControllers.getAllUsers);
router.get('/:id', protect, authorize('admin'), UserControllers.getUserById);
router.put('/:id', protect, authorize('admin'), ...UserControllers.updateUser);
router.delete('/:id', protect, authorize('admin'), UserControllers.deleteUser);

// Password can be updated by the authenticated user themselves
router.patch('/:id/password', protect, ...UserControllers.updatePassword);

export const UserRoutes = router;
