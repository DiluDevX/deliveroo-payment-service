import { Router } from 'express';
import healthRoutes from './health.routes';
import paymentRoutes from './payment.routes';

const router = Router();

router.use('/health', healthRoutes);
router.use('/payments', paymentRoutes);

export default router;
