"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRoutes = void 0;
const express_1 = require("express");
const user_controller_1 = require("./user.controller");
const protect_1 = require("../../middlewares/protect");
const authorize_1 = require("../../middlewares/authorize");
const router = (0, express_1.Router)();
// Admin-only routes
router.post('/', protect_1.protect, (0, authorize_1.authorize)('admin'), ...user_controller_1.UserControllers.createUser);
router.get('/', protect_1.protect, (0, authorize_1.authorize)('admin'), ...user_controller_1.UserControllers.getAllUsers);
router.get('/:id', protect_1.protect, (0, authorize_1.authorize)('admin'), user_controller_1.UserControllers.getUserById);
router.put('/:id', protect_1.protect, (0, authorize_1.authorize)('admin'), ...user_controller_1.UserControllers.updateUser);
router.delete('/:id', protect_1.protect, (0, authorize_1.authorize)('admin'), user_controller_1.UserControllers.deleteUser);
// Password can be updated by the authenticated user themselves
router.patch('/:id/password', protect_1.protect, ...user_controller_1.UserControllers.updatePassword);
exports.UserRoutes = router;
