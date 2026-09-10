import type { Request, Response } from 'express';
import { loginSchema } from '../dtos/auth.dto.js';
import { AuthService } from '../services/auth.service.js';

export class AuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const validatedData = loginSchema.parse(req.body);
      const result = await AuthService.login(validatedData);
      
      // Set HttpOnly cookie
      res.cookie('token', result.token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 24 * 60 * 60 * 1000 // 1 day
      });

      // Send the rest of the user data without the token
      const { token, ...userData } = result;
      
      res.status(200).json({ success: true, data: userData });
    } catch (error: any) {
      // 401 Unauthorized as requested by the task
      res.status(401).json({ success: false, error: error.errors || error.message });
    }
  }

  static async logout(req: Request, res: Response): Promise<void> {
    res.clearCookie('token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    res.status(200).json({ success: true, message: 'Logged out successfully' });
  }
}
