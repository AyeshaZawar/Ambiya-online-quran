import mongoose from 'mongoose';
import fs from 'fs';
import path from 'path';
import { env } from './env';

let memoryServerInstance: { getUri: () => string; stop: () => Promise<boolean> } | null = null;
let isDbConnected = false;
let dbMode: 'external' | 'embedded-mongod' | 'embedded-fallback' | 'disconnected' = 'disconnected';
let dbInitPromise: Promise<boolean> | null = null;
let dbInitInProgress = false;
let lastDbError: string | null = null;
let lastAttemptAt = 0;

export function getDbStatus() {
  return {
    connected: isDbConnected && mongoose.connection.readyState === 1,
    mode: isDbConnected && mongoose.connection.readyState === 1 ? dbMode : 'disconnected',
    ready: isDbConnected && mongoose.connection.readyState === 1 && !dbInitInProgress,
    ...(lastDbError ? { lastError: lastDbError } : {}),
  };
}

export async function waitForDatabase(timeoutMs = 15000): Promise<boolean> {
  if (!dbInitInProgress && mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return true;
  }
  if (!dbInitPromise) return mongoose.connection.readyState === 1;
  return Promise.race([
    dbInitPromise,
    new Promise<boolean>((resolve) => setTimeout(() => resolve(false), timeoutMs)),
  ]);
}

export function setDatabaseInitPromise(promise: Promise<boolean>) {
  dbInitInProgress = true;
  dbInitPromise = promise.finally(() => {
    dbInitInProgress = false;
  });
}

async function startEmbeddedMongod(): Promise<string> {
  const { MongoMemoryServer } = await import('mongodb-memory-server');
  const dbPath = path.resolve(process.cwd(), '.mongodb-data');
  if (!fs.existsSync(dbPath)) {
    fs.mkdirSync(dbPath, { recursive: true });
  }
  memoryServerInstance = await MongoMemoryServer.create({
    instance: {
      dbName: 'adam_muhammad_quran_academy',
      dbPath,
      storageEngine: 'wiredTiger',
    },
  });
  return memoryServerInstance.getUri();
}

export async function connectDatabase(): Promise<boolean> {
  if (mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return true;
  }

  if (env.mongodbUri) {
    try {
      await mongoose.connect(env.mongodbUri, {
        serverSelectionTimeoutMS: 5000,
      });
      isDbConnected = true;
      dbMode = 'external';
      lastDbError = null;
      console.log('[MongoDB] Connected successfully to external MONGODB_URI via Mongoose.');
      return true;
    } catch (err) {
      const msg = (err as Error).message;
      lastDbError = msg;

      if (env.isProd) {
        console.error('[MongoDB] Connection failed in production:', msg);
        isDbConnected = false;
        dbMode = 'disconnected';
        return false;
      }

      console.warn(
        `[MongoDB] External MONGODB_URI unreachable (${msg}). ` +
          'Ensure 0.0.0.0/0 is whitelisted in MongoDB Atlas Network Access. ' +
          'Falling back to persistent local mongod (.mongodb-data) for preview.'
      );
    }
  }

  if (env.isProd) {
    lastDbError = 'MONGODB_URI is not set in production environment.';
    console.error('[MongoDB]', lastDbError);
    return false;
  }

  try {
    const localUri = await startEmbeddedMongod();
    await mongoose.connect(localUri, {
      serverSelectionTimeoutMS: 8000,
    });
    isDbConnected = true;
    dbMode = env.mongodbUri ? 'embedded-fallback' : 'embedded-mongod';
    console.log(
      `[MongoDB] Connected to persistent local mongod (.mongodb-data, mode=${dbMode}).`
    );
    return true;
  } catch (err) {
    lastDbError = (err as Error).message;
    console.warn('[MongoDB] Embedded MongoDB failed to start. Public fallback content remains active.', err);
    isDbConnected = false;
    dbMode = 'disconnected';
    return false;
  }
}

export async function retryDatabaseIfNeeded(onConnected?: () => Promise<void>): Promise<boolean> {
  // Wait for any active startup init (including initial seeding) first
  if (dbInitInProgress && dbInitPromise) {
    const initialResult = await waitForDatabase(15000);
    if (initialResult && Number(mongoose.connection.readyState) === 1) {
      return true;
    }
  }

  if (mongoose.connection.readyState === 1) {
    isDbConnected = true;
    return true;
  }

  // Avoid hammering MongoDB if we just tried within the last 5 seconds
  const now = Date.now();
  if (now - lastAttemptAt < 5000) {
    return false;
  }
  lastAttemptAt = now;

  const reconnectPromise = (async () => {
    const ok = await connectDatabase();
    if (ok && onConnected) {
      await onConnected();
    }
    return ok;
  })();
  dbInitPromise = reconnectPromise;
  return reconnectPromise;
}

export async function disconnectDatabase(): Promise<void> {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (memoryServerInstance) {
    await memoryServerInstance.stop();
    memoryServerInstance = null;
  }
  isDbConnected = false;
  dbMode = 'disconnected';
}
