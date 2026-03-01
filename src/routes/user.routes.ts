import { Router } from 'express';
import { userController } from '../controllers/user.controller';
import { validate } from '../middleware/validate.middleware';
import { createUserSchema } from '../schema/user.schema';
import { updateUserSchema } from '../schema/user.schema';

const router = Router();

router.get('/', userController.getAll);
router.get('/:id', userController.getOne);
router.post('/', validate(createUserSchema), userController.create);
router.patch('/:id', validate(updateUserSchema), userController.update);
router.delete('/:id', userController.delete);

export default router;
