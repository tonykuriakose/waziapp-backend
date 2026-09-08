import { createProjectSchema } from '../dtos/project.dto.js';
import { ProjectService } from '../services/project.service.js';
import { Role } from '@prisma/client';
export class ProjectController {
    static async create(req, res) {
        try {
            const validatedData = createProjectSchema.parse(req.body);
            // Force the tenantId to be the user's tenantId (unless Super Admin)
            let tenantId = req.user?.tenantId;
            if (req.user?.role === Role.SUPER_ADMIN && req.body.tenantId) {
                tenantId = req.body.tenantId;
            }
            if (!tenantId) {
                res.status(400).json({ error: 'Tenant context is missing' });
                return;
            }
            const project = await ProjectService.createProject({
                ...validatedData,
                tenantId,
            });
            res.status(201).json({ success: true, data: project });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.errors || error.message });
        }
    }
    static async getProjects(req, res) {
        try {
            let tenantId = req.user?.tenantId;
            // Super Admin can list all projects across all tenants if tenantId is not in query
            if (req.user?.role === Role.SUPER_ADMIN) {
                tenantId = req.query.tenantId ? req.query.tenantId : null;
            }
            const projects = await ProjectService.getProjects(tenantId);
            res.status(200).json({ success: true, data: projects });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async getById(req, res) {
        try {
            const tenantId = req.user?.role === Role.SUPER_ADMIN ? null : req.user?.tenantId;
            const project = await ProjectService.getProjectById(req.params.id, tenantId);
            if (!project) {
                res.status(404).json({ error: 'Project not found' });
                return;
            }
            res.status(200).json({ success: true, data: project });
        }
        catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }
    }
    static async update(req, res) {
        try {
            const tenantId = req.user?.role === Role.SUPER_ADMIN ? null : req.user?.tenantId;
            const project = await ProjectService.updateProject(req.params.id, req.body, tenantId);
            res.status(200).json({ success: true, data: project });
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
    static async delete(req, res) {
        try {
            const tenantId = req.user?.role === Role.SUPER_ADMIN ? null : req.user?.tenantId;
            await ProjectService.deleteProject(req.params.id, tenantId);
            res.status(204).send();
        }
        catch (error) {
            res.status(400).json({ success: false, error: error.message });
        }
    }
}
//# sourceMappingURL=project.controller.js.map