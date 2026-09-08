import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret';
export class AuthService {
    static async login(data) {
        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });
        if (!user) {
            throw new Error('Invalid email or password');
        }
        if (!user.isActive) {
            throw new Error('User account is deactivated');
        }
        const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);
        if (!isPasswordValid) {
            throw new Error('Invalid email or password');
        }
        // Generate JWT Token
        const payload = {
            userId: user.id,
            tenantId: user.tenantId,
            role: user.role,
            permissions: user.permissions
        };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
                tenantId: user.tenantId,
                permissions: user.permissions
            }
        };
    }
}
//# sourceMappingURL=auth.service.js.map