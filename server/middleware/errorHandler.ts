import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';
import multer from 'multer';

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof ZodError) {
    const firstIssue = err.issues[0];
    res.status(400).json({
      error: firstIssue ? `${firstIssue.path.join('.') || 'Input'}: ${firstIssue.message}` : 'Validation failed',
      details: err.issues,
    });
    return;
  }

  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      res.status(400).json({ error: 'Image file size must be 5 MB or smaller.' });
      return;
    }
    res.status(400).json({ error: err.message });
    return;
  }

  if (err instanceof Error) {
    if (err.message.includes('Invalid image file type')) {
      res.status(400).json({ error: err.message });
      return;
    }
    if (
      err.name === 'MongooseServerSelectionError' ||
      err.message.includes('buffering timed out') ||
      err.message.includes('Client must be connected')
    ) {
      console.error('[MongoDB Error]', err.message);
      res.status(503).json({
        error:
          'Unable to connect to MongoDB. Please verify MONGODB_URI and ensure your server IP (or 0.0.0.0/0) is whitelisted in MongoDB Atlas Network Access.',
      });
      return;
    }
    console.error('[API Error]', err);
    res.status(500).json({ error: 'An unexpected server error occurred.' });
    return;
  }

  res.status(500).json({ error: 'An unexpected server error occurred.' });
}
