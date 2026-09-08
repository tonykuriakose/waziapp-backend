import { PrismaClient } from '@prisma/client';
import type { CreateProjectInput } from '../dtos/project.dto.js';

const prisma = new PrismaClient();

export class ProjectService {
  
  // Create a new project
  static async createProject(data: CreateProjectInput) {
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
  static async getProjects(tenantId?: string | null) {
    return await prisma.project.findMany({
      where: tenantId ? { tenantId } : undefined,
      orderBy: { createdAt: 'desc' }
    });
  }

  static async getProjectById(id: string, tenantId?: string | null) {
    const project = await prisma.project.findUnique({
      where: { id }
    });
    
    if (tenantId && project && project.tenantId !== tenantId) {
      return null;
    }
    return project;
  }

  static async updateProject(id: string, data: any, tenantId?: string | null) {
    // Basic auth check
    const project = await this.getProjectById(id, tenantId);
    if (!project) throw new Error('Project not found or unauthorized');

    return await prisma.project.update({
      where: { id },
      data,
    });
  }

  static async deleteProject(id: string, tenantId?: string | null) {
    const project = await this.getProjectById(id, tenantId);
    if (!project) throw new Error('Project not found or unauthorized');

    await prisma.project.delete({
      where: { id },
    });
  }
}
