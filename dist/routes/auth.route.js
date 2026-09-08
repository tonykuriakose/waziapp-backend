import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { authRateLimiter } from '../middlewares/rate-limiter.middleware.js';
const router = Router();
// Apply the strict 5 requests/15 mins rate limiter to the login route
router.post('/login', AuthController.login);
export default router;
//# sourceMappingURL=auth.route.js.map