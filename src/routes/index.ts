import { Router } from 'express';
import userRoutes from './user.routes';
import healthRoutes from './health.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/users', userRoutes);

export default router;
