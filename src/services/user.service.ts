import { PrismaClient, type User, Role } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export class UserService {
  static async createUser(data: any): Promise<Partial<User>> {
    const hashedPassword = await bcrypt.hash(data.password, 10);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash: hashedPassword,
        role: data.role,
        tenantId: data.tenantId,
        permissions: data.permissions || [],
      },
    });

    return {
      id: user.id,
      email: user.email,
      role: user.role,
      tenantId: user.tenantId,
    };
  }

  static async listUsers(tenantId?: string | null): Promise<Partial<User>[]> {
    const users = await prisma.user.findMany({
      where: tenantId ? { tenantId } : undefined,
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        tenantId: true,
        permissions: true,
      },
    });
    return users;
  }

  static async updateUser(id: string, data: any): Promise<Partial<User>> {
    const user = await prisma.user.update({
      where: { id },
      data: {
        isActive: data.isActive,
        permissions: data.permissions,
        role: data.role,
      },
      select: {
        id: true,
        email: true,
        role: true,
        isActive: true,
        tenantId: true,
        permissions: true,
      }
    });
    return user;
  }

  static async updateRolePermissions(role: Role, permissions: string[]): Promise<void> {
    // 1. Update or create the RolePermission defaults
    await prisma.rolePermission.upsert({
      where: { role },
      update: { permissions },
      create: { role, permissions },
    });

    // 2. Update existing users with that role
    await prisma.user.updateMany({
      where: { role },
      data: { permissions },
    });
  }
}
