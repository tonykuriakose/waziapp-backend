import { z } from "zod";
export declare const createProjectSchema: z.ZodObject<{
    name: z.ZodString;
    address: z.ZodString;
    useCase: z.ZodString;
    status: z.ZodEnum<["ACTIVE", "INACTIVE", "DRAFT"]>;
    tenantId: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name?: string;
    address?: string;
    useCase?: string;
    status?: "ACTIVE" | "INACTIVE" | "DRAFT";
    tenantId?: string;
}, {
    name?: string;
    address?: string;
    useCase?: string;
    status?: "ACTIVE" | "INACTIVE" | "DRAFT";
    tenantId?: string;
}>;
export type CreateProjectInput = z.infer<typeof createProjectSchema>;
//# sourceMappingURL=project.dto.d.ts.map