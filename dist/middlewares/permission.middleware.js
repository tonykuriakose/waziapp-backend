import { Role } from '@prisma/client';
export const requirePermission = (requiredPermission) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user) {
            res.status(401).json({ error: 'Unauthorized: User not found in request' });
            return;
        }
        // Super Admin bypasses permission checks (unless strictly required otherwise)
        if (user.role === Role.SUPER_ADMIN) {
            next();
            return;
        }
        // Check if the user's permissions array includes the required permission
        if (user.permissions && user.permissions.includes(requiredPermission)) {
            next();
            return;
        }
        res.status(403).json({ error: `Forbidden: Missing required permission: ${requiredPermission}` });
    };
};
//# sourceMappingURL=permission.middleware.js.map