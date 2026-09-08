import { type User } from '@prisma/client';
import type { LoginInput } from '../dtos/auth.dto.js';
export declare class AuthService {
    static login(data: LoginInput): Promise<{
        token: string;
        user: Partial<User>;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map