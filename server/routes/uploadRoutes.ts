import { Router, Request, Response, NextFunction } from 'express';
import { requireAdmin } from '../middleware/auth';
import { imageUploadMiddleware, storeUploadedImage } from '../utils/upload';

const router = Router();

router.post(
  '/image',
  requireAdmin,
  imageUploadMiddleware.single('image'),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        res.status(400).json({ error: 'Please select an image file to upload (JPG, PNG, or WebP).' });
        return;
      }

      const result = await storeUploadedImage(req.file);
      res.status(201).json({
        url: result.url,
        provider: result.provider,
        size: result.size,
        mimetype: result.mimetype,
      });
    } catch (err) {
      next(err);
    }
  }
);

export default router;
