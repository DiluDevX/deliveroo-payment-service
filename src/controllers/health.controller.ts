import { Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';

export const healthController = {
  health(_req: Request, res: Response): void {
    res.status(StatusCodes.OK).json({
      success: true,
      message: 'Service is healthy',
      data: {
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
      },
    });
  },
};
