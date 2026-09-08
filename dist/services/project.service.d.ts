import type { CreateProjectInput } from '../dtos/project.dto.js';
export declare class ProjectService {
    static createProject(data: CreateProjectInput): Promise<{
        name: string;
        address: string;
        useCase: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static getProjects(tenantId?: string | null): Promise<{
        name: string;
        address: string;
        useCase: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    static getProjectById(id: string, tenantId?: string | null): Promise<{
        name: string;
        address: string;
        useCase: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static updateProject(id: string, data: any, tenantId?: string | null): Promise<{
        name: string;
        address: string;
        useCase: string;
        status: import(".prisma/client").$Enums.ProjectStatus;
        tenantId: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    static deleteProject(id: string, tenantId?: string | null): Promise<void>;
}
//# sourceMappingURL=project.service.d.ts.map