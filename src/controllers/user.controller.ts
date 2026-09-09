import type { Request, Response } from 'express';
import { UserService } from '../services/user.service.js';
import { Role } from '@prisma/client';

export class UserController {
  static async createUser(req: Request, res: Response): Promise<void> {
    try {
      const { email, password, role, permissions } = req.body;
      let tenantId = req.user?.tenantId;

      // Super Admin can specify a tenantId. Admin must create in their own tenant.
      if (req.user?.role === Role.SUPER_ADMIN && req.body.tenantId) {
        tenantId = req.body.tenantId;
      }

      // Security: Admins cannot create Super Admins or Admins
      if (req.user?.role === Role.ADMIN && (role === Role.SUPER_ADMIN || role === Role.ADMIN)) {
        res.status(403).json({ error: 'Admins can only create Agents' });
        return;
      }

      // Security: No one can create additional Super Admins
      if (role === Role.SUPER_ADMIN) {
        res.status(403).json({ error: 'System is restricted to one Super Admin' });
        return;
      }

      const user = await UserService.createUser({
        email,
        password,
        role,
        tenantId,
        permissions,
      });

      res.status(201).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async listUsers(req: Request, res: Response): Promise<void> {
    try {
      let tenantId = req.user?.tenantId;

      // Super Admin can list all users if they don't specify tenantId
      if (req.user?.role === Role.SUPER_ADMIN) {
        tenantId = req.query.tenantId ? (req.query.tenantId as string) : null;
      }

      const users = await UserService.listUsers(tenantId);
      res.status(200).json(users);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const { isActive, permissions, role } = req.body;

      // Prevent modifying a SUPER_ADMIN's active status or role
      const users = await UserService.listUsers(null);
      const targetUser = users.find(u => u.id === id);
      
      if (!targetUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (targetUser.role === Role.SUPER_ADMIN) {
        if (isActive === false) {
          res.status(403).json({ error: 'Cannot disable the system Super Admin' });
          return;
        }
      }
      
      const user = await UserService.updateUser(id, { isActive, permissions, role });
      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // We should prevent deleting a SUPER_ADMIN here
      const users = await UserService.listUsers(null);
      const targetUser = users.find(u => u.id === id);
      
      if (!targetUser) {
        res.status(404).json({ error: 'User not found' });
        return;
      }
      
      if (targetUser.role === Role.SUPER_ADMIN) {
        res.status(403).json({ error: 'Cannot delete a Super Admin' });
        return;
      }

      await UserService.deleteUser(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  static async updateRolePermissions(req: Request, res: Response): Promise<void> {
    try {
      // Only Super Admin can hit this (enforced by route middleware)
      const role = req.params.role as Role;
      const { permissions } = req.body;

      await UserService.updateRolePermissions(role, permissions);
      res.status(200).json({ message: `Permissions for ${role} updated successfully` });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
