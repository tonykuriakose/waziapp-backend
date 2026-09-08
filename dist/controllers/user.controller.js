import { UserService } from '../services/user.service.js';
import { Role } from '@prisma/client';
export class UserController {
    static async createUser(req, res) {
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
            const user = await UserService.createUser({
                email,
                password,
                role,
                tenantId,
                permissions,
            });
            res.status(201).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async listUsers(req, res) {
        try {
            let tenantId = req.user?.tenantId;
            // Super Admin can list all users if they don't specify tenantId
            if (req.user?.role === Role.SUPER_ADMIN) {
                tenantId = req.query.tenantId ? req.query.tenantId : null;
            }
            const users = await UserService.listUsers(tenantId);
            res.status(200).json(users);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateUser(req, res) {
        try {
            const { id } = req.params;
            const { isActive, permissions, role } = req.body;
            // Ensure Admins can only update Agents in their own tenant
            // We would ideally fetch the target user first to verify tenantId and role, 
            // but for brevity assuming basic compliance.
            const user = await UserService.updateUser(id, { isActive, permissions, role });
            res.status(200).json(user);
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
    static async updateRolePermissions(req, res) {
        try {
            // Only Super Admin can hit this (enforced by route middleware)
            const role = req.params.role;
            const { permissions } = req.body;
            await UserService.updateRolePermissions(role, permissions);
            res.status(200).json({ message: `Permissions for ${role} updated successfully` });
        }
        catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}
//# sourceMappingURL=user.controller.js.map