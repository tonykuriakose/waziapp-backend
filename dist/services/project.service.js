import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
export class ProjectService {
    // Create a new project
    static async createProject(data) {
        // Here we can add business logic (e.g., checking limits, AI enhancement)
        const newProject = await prisma.project.create({
            data: {
                name: data.name,
                address: data.address,
                useCase: data.useCase,
                status: data.status,
                tenantId: data.tenantId,
            },
        });
        return newProject;
    }
    // Get projects for a specific tenant or all (if no tenantId)
    static async getProjects(tenantId) {
        return await prisma.project.findMany({
            where: tenantId ? { tenantId } : undefined,
            orderBy: { createdAt: 'desc' }
        });
    }
    static async getProjectById(id, tenantId) {
        const project = await prisma.project.findUnique({
            where: { id }
        });
        if (tenantId && project && project.tenantId !== tenantId) {
            return null;
        }
        return project;
    }
    static async updateProject(id, data, tenantId) {
        // Basic auth check
        const project = await this.getProjectById(id, tenantId);
        if (!project)
            throw new Error('Project not found or unauthorized');
        return await prisma.project.update({
            where: { id },
            data,
        });
    }
    static async deleteProject(id, tenantId) {
        const project = await this.getProjectById(id, tenantId);
        if (!project)
            throw new Error('Project not found or unauthorized');
        await prisma.project.delete({
            where: { id },
        });
    }
}
//# sourceMappingURL=project.service.js.map