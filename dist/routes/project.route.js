import { Router } from 'express';
import { ProjectController } from '../controllers/project.controller.js';
import { requirePermission } from '../middlewares/permission.middleware.js';
import { authenticateJWT } from '../middlewares/auth.middleware.js';
const router = Router();
router.use(authenticateJWT);
router.post('/', requirePermission('projects.create'), ProjectController.create);
router.get('/', requirePermission('projects.read'), ProjectController.getProjects);
router.get('/:id', requirePermission('projects.read'), ProjectController.getById);
router.put('/:id', requirePermission('projects.update'), ProjectController.update);
router.delete('/:id', requirePermission('projects.delete'), ProjectController.delete);
export default router;
//# sourceMappingURL=project.route.js.map