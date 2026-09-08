import { PrismaClient, type User } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import type { LoginInput } from '../dtos/auth.dto.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'my_secret';

export class AuthService {
  static async login(data: LoginInput): Promise<{ token: string; user: Partial<User> }> {
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
