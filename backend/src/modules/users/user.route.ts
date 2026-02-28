import { Router } from 'express';
import { UserControllers } from './user.controller';

const router = Router();

// Basic CRUD operations
router.post('/', ...UserControllers.createUser);
router.get('/', ...UserControllers.getAllUsers);
router.get('/:id', UserControllers.getUserById);
router.put('/:id', ...UserControllers.updateUser);
router.delete('/:id', UserControllers.deleteUser);

// Password management
router.patch('/:id/password', ...UserControllers.updatePassword);

export const UserRoutes = router;