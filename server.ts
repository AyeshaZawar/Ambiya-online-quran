import express from 'express';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import path from 'path';
import { env } from './server/config/env';
import {
  connectDatabase,
  disconnectDatabase,
  getDbStatus,
  retryDatabaseIfNeeded,
  setDatabaseInitPromise,
} from './server/config/db';
import { seedDatabaseIfEmpty } from './server/config/seed';
import { ensureUploadDir, UPLOAD_DIR } from './server/utils/upload';
import publicRoutes from './server/routes/publicRoutes';
import authRoutes from './server/routes/authRoutes';
import adminRoutes from './server/routes/adminRoutes';
import uploadRoutes from './server/routes/uploadRoutes';
import { errorHandler } from './server/middleware/errorHandler';

async function startServer() {
  const app = express();

  app.set('trust proxy', 1);

  app.use(
    helmet({
      contentSecurityPolicy: false,
      crossOriginEmbedderPolicy: false,
      crossOriginOpenerPolicy: false,
      crossOriginResourcePolicy: { policy: 'cross-origin' },
      frameguard: false,
    })
  );

  app.use(cookieParser());
  app.use(express.json({ limit: '2mb' }));
  app.use(express.urlencoded({ extended: true, limit: '2mb' }));

  ensureUploadDir();
  app.use('/uploads', express.static(UPLOAD_DIR));

  // Connect MongoDB and run idempotent initial seed in the background
  // so Express binds port 3000 immediately without blocking health checks.
  const initDbAndSeed = (async () => {
    const connected = await connectDatabase();
    if (connected) {
      await seedDatabaseIfEmpty({ seedAdmin: true });
    }
    return connected;
  })();
  setDatabaseInitPromise(initDbAndSeed);

  // Health Check (always responds immediately)
  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      db: getDbStatus(),
    });
  });

  // Ensure DB connection (auto-retries if Atlas whitelist was just updated)
  app.use(['/api/public', '/api/auth', '/api/admin'], async (req, res, next) => {
    const connected = await retryDatabaseIfNeeded(async () => {
      await seedDatabaseIfEmpty({ seedAdmin: true });
    });

    // Public bootstrap GET gracefully serves fallback data if DB is unreachable;
    // auth, admin, and form submissions return an explicit 503 instead of buffering timeout.
    const isBootstrapGet = req.originalUrl.startsWith('/api/public/bootstrap') && req.method === 'GET';
    if (!connected && !isBootstrapGet) {
      res.status(503).json({
        error:
          'MongoDB is currently unreachable. Please check MONGODB_URI and ensure 0.0.0.0/0 is added to MongoDB Atlas Network Access.',
      });
      return;
    }

    next();
  });

  // REST API Routes
  app.use('/api/public', publicRoutes);
  app.use('/api/auth', authRoutes);
  app.use('/api/admin/upload', uploadRoutes);
  app.use('/api/admin', adminRoutes);

  // API Error Handler
  app.use('/api', errorHandler);

  // Vite Middleware (Development) or Static Dist (Production)
  if (!env.isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const server = app.listen(env.port, '0.0.0.0', () => {
    console.log(`[Server] Running on http://0.0.0.0:${env.port} (${env.nodeEnv})`);
  });

  const gracefulShutdown = async (signal: string) => {
    console.log(`[Server] Received ${signal}, shutting down cleanly...`);
    server.close(async () => {
      await disconnectDatabase();
      process.exit(0);
    });
    setTimeout(async () => {
      await disconnectDatabase();
      process.exit(0);
    }, 5000).unref();
  };

  process.once('SIGINT', () => gracefulShutdown('SIGINT'));
  process.once('SIGTERM', () => gracefulShutdown('SIGTERM'));
}

startServer().catch((err) => {
  console.error('[Server] Fatal startup error:', err);
  process.exit(1);
});
