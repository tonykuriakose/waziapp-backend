import { type User, Role } from '@prisma/client';
export declare class UserService {
    static createUser(data: any): Promise<Partial<User>>;
    static listUsers(tenantId?: string | null): Promise<Partial<User>[]>;
    static updateUser(id: string, data: any): Promise<Partial<User>>;
    static updateRolePermissions(role: Role, permissions: string[]): Promise<void>;
}
//# sourceMappingURL=user.service.d.ts.map