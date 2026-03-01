import { Request, Response, NextFunction } from 'express';
import { StatusCodes } from 'http-status-codes';
import { userService } from '../services/user.service';
import { logger } from '../utils/logger';

export const userController = {
  async create(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const { firstName, lastName, email, password } = req.body as {
        firstName: string;
        lastName: string;
        email: string;
        password: string;
      };

      logger.info({ email }, 'Controller: create user request');

      const user = await userService.createUser(firstName, lastName, email, password);

      logger.info({ userId: user.id }, 'Controller: user created');

      res.status(StatusCodes.CREATED).json({
        success: true,
        message: 'User created successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async getAll(_req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      logger.info('Controller: get all users request');

      const users = await userService.getAllUsers();

      logger.info({ count: users.length }, 'Controller: users fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'Users retrieved successfully',
        data: users,
        pagination: {
          page: 1,
          limit: users.length,
          total: users.length,
          totalPages: 1,
        },
      });
    } catch (error) {
      next(error);
    }
  },

  async getOne(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ userId: id }, 'Controller: get user by id request');

      const user = await userService.getUserById(id);

      logger.info({ userId: id }, 'Controller: user fetched');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User retrieved successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async update(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;
      const updateData = req.body as {
        firstName?: string;
        lastName?: string;
        email?: string;
        password?: string;
      };

      logger.info({ userId: id }, 'Controller: update user request');

      const user = await userService.updateUser(id, updateData);

      logger.info({ userId: id }, 'Controller: user updated');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  async delete(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = req.params['id'] as string;

      logger.info({ userId: id }, 'Controller: delete user request');

      await userService.deleteUser(id);

      logger.info({ userId: id }, 'Controller: user deleted');

      res.status(StatusCodes.OK).json({
        success: true,
        message: 'User deleted successfully',
        data: null,
      });
    } catch (error) {
      next(error);
    }
  },
};
