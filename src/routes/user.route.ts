import { Router } from 'express';
import { UserController } from '../controllers/user.controller.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { Role } from '@prisma/client';

const router = Router();

// Protect all user routes
router.use(authenticateJWT);

// User Management Routes
router.post('/', requirePermission('users.create'), UserController.createUser);
router.get('/', requirePermission('users.read'), UserController.listUsers);
router.put('/:id', requirePermission('users.update'), UserController.updateUser);
// Note: Users disable/enable is handled via update (isActive flag)

// Permission Management Route (Super Admin Only)
router.put(
  '/permissions/roles/:role',
  requirePermission('permissions.manage'),
  UserController.updateRolePermissions
);

export default router;
