import express from 'express';
import { env } from './config/environment';
import { connectDatabase } from './config/database';
import { requestLoggerMiddleware } from './middleware/request-logger.middleware';
import { errorHandlerMiddleware } from './middleware/error-handler.middleware';
import router from './routes/index';
import { logger } from './utils/logger';

const app = express();

// Parse JSON request bodies
app.use(express.json());

// Log all incoming requests
app.use(requestLoggerMiddleware);

// Register all routes under /api/v1
app.use('/api/v1', router);

// Global error handler (must be last middleware)
app.use(errorHandlerMiddleware);

async function startServer(): Promise<void> {
  try {
    await connectDatabase();

    app.listen(env.PORT, () => {
      logger.info(
        { port: env.PORT, env: env.NODE_ENV, service: env.SERVICE_NAME },
        'Server started successfully'
      );
    });
  } catch (error) {
    logger.fatal({ error }, 'Failed to start server');
    process.exit(1);
  }
}

// Graceful shutdown handlers
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received. Shutting down gracefully...');
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received. Shutting down gracefully...');
  process.exit(0);
});

void startServer();

export default app;
