import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import projectRoutes from './routes/project.route.js';
import authRoutes from './routes/auth.route.js';
import { apiRateLimiter } from './middlewares/rate-limiter.middleware.js';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// middlware for secure http
app.use(helmet());
app.use(cors()); 
app.use(express.json());

// General API Rate Limiting (100 req/min)
app.use('/api', apiRateLimiter);

import userRoutes from './routes/user.route.js';

// Attach Routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/users', userRoutes);

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json({ status: 'success', message: 'Wazi Backend is running!' });
});

// Start the server
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});