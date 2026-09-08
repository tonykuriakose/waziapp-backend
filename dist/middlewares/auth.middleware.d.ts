import type { Request, Response, NextFunction } from 'express';
declare global {
    namespace Express {
        interface Request {
            user?: {
                userId: string;
                tenantId: string | null;
                role: string;
                permissions: string[];
            };
        }
    }
}
export declare const authenticateJWT: (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=auth.middleware.d.ts.map