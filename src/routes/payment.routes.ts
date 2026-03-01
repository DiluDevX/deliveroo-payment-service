import { Router } from 'express';
import { paymentController } from '../controllers/payment.controller';
import { validate } from '../middleware/validate.middleware';
import { createPaymentSchema, updatePaymentSchema } from '../schema/payment.schema';

const router = Router();

router.get('/', paymentController.getAll);
router.get('/order/:orderId', paymentController.getByOrder);
router.get('/:id', paymentController.getOne);
router.post('/', validate(createPaymentSchema), paymentController.create);
router.patch('/:id', validate(updatePaymentSchema), paymentController.update);
router.delete('/:id', paymentController.delete);
router.post('/:id/refund', paymentController.refund);

export default router;
