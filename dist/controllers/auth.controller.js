import { loginSchema } from '../dtos/auth.dto.js';
import { AuthService } from '../services/auth.service.js';
export class AuthController {
    static async login(req, res) {
        try {
            const validatedData = loginSchema.parse(req.body);
            const result = await AuthService.login(validatedData);
            res.status(200).json({ success: true, data: result });
        }
        catch (error) {
            // 401 Unauthorized as requested by the task
            res.status(401).json({ success: false, error: error.errors || error.message });
        }
    }
}
//# sourceMappingURL=auth.controller.js.map