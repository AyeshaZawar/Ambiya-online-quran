import multer from 'multer';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { env } from '../config/env';

const ALLOWED_MIME_TYPES: Record<string, string> = {
  'image/jpeg': '.jpg',
  'image/jpg': '.jpg',
  'image/png': '.png',
  'image/webp': '.webp',
};

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

export const UPLOAD_DIR = path.resolve(process.cwd(), 'public', 'uploads');

export function ensureUploadDir(): void {
  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
  }
}

export const imageUploadMiddleware = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter: (_req, file, cb) => {
    if (!ALLOWED_MIME_TYPES[file.mimetype]) {
      cb(new Error('Invalid image file type. Only JPG, PNG, and WebP images are allowed.'));
      return;
    }
    cb(null, true);
  },
});

function hasValidImageMagicBytes(buffer: Buffer, mimetype: string): boolean {
  if (buffer.length < 12) return false;
  if (mimetype === 'image/png') {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47
    );
  }
  if (mimetype === 'image/jpeg' || mimetype === 'image/jpg') {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }
  if (mimetype === 'image/webp') {
    return (
      buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
      buffer.subarray(8, 12).toString('ascii') === 'WEBP'
    );
  }
  return false;
}

export async function storeUploadedImage(file: Express.Multer.File): Promise<{
  url: string;
  provider: 'cloudinary' | 'local';
  size: number;
  mimetype: string;
}> {
  if (!hasValidImageMagicBytes(file.buffer, file.mimetype)) {
    throw new Error('Invalid image file type. File contents do not match an allowed image format.');
  }

  // Use Cloudinary if credentials are configured in environment variables
  if (env.cloudinaryCloudName && env.cloudinaryApiKey && env.cloudinaryApiSecret) {
    const timestamp = Math.floor(Date.now() / 1000);
    const folder = 'adam-to-muhammad-academy';
    const signaturePayload = `folder=${folder}&timestamp=${timestamp}${env.cloudinaryApiSecret}`;
    const signature = crypto.createHash('sha1').update(signaturePayload).digest('hex');

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(file.buffer)], { type: file.mimetype });
    formData.append('file', blob, file.originalname);
    formData.append('api_key', env.cloudinaryApiKey);
    formData.append('timestamp', String(timestamp));
    formData.append('folder', folder);
    formData.append('signature', signature);

    const uploadRes = await fetch(
      `https://api.cloudinary.com/v1_1/${env.cloudinaryCloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadRes.ok) {
      const errText = await uploadRes.text();
      throw new Error(`Cloud image upload failed: ${errText}`);
    }

    const result = (await uploadRes.json()) as { secure_url: string };
    return {
      url: result.secure_url,
      provider: 'cloudinary',
      size: file.size,
      mimetype: file.mimetype,
    };
  }

  // Fallback to secure local storage under /public/uploads/
  ensureUploadDir();
  const ext = ALLOWED_MIME_TYPES[file.mimetype] || '.jpg';
  const uniqueName = `${Date.now()}-${crypto.randomUUID()}${ext}`;
  const destination = path.join(UPLOAD_DIR, uniqueName);
  await fs.promises.writeFile(destination, file.buffer);

  return {
    url: `/uploads/${uniqueName}`,
    provider: 'local',
    size: file.size,
    mimetype: file.mimetype,
  };
}
