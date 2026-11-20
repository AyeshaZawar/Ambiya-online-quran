import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { env } from '../config/env';
import { Admin } from '../models/Admin';

export interface AuthenticatedRequest extends Request {
  admin?: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

export const ADMIN_COOKIE_NAME = 'amqa_admin_session';

export function signAdminToken(payload: { id: string; email: string; role: string }): string {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn as jwt.SignOptions['expiresIn'],
  });
}

function isHttpsRequest(req?: Request): boolean {
  if (!req) return env.isProd;
  const proto = req.headers['x-forwarded-proto'];
  const forwardedHttps =
    typeof proto === 'string'
      ? proto.split(',')[0].trim().toLowerCase() === 'https'
      : false;
  return Boolean(req.secure || forwardedHttps || env.isProd);
}

export function setAdminSessionCookie(res: Response, token: string, req?: Request): void {
  const isHttps = isHttpsRequest(req);
  res.cookie(ADMIN_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    path: '/',
  });
}

export function clearAdminSessionCookie(res: Response, req?: Request): void {
  const isHttps = isHttpsRequest(req);
  res.clearCookie(ADMIN_COOKIE_NAME, {
    httpOnly: true,
    sameSite: isHttps ? 'none' : 'lax',
    secure: isHttps,
    path: '/',
  });
}

function extractAdminToken(req: Request): string | undefined {
  const cookieToken = req.cookies?.[ADMIN_COOKIE_NAME];
  if (typeof cookieToken === 'string' && cookieToken.trim().length > 0) {
    return cookieToken.trim();
  }
  const authHeader = req.headers.authorization;
  if (typeof authHeader === 'string' && authHeader.startsWith('Bearer ')) {
    const bearer = authHeader.slice(7).trim();
    if (bearer.length > 0) {
      return bearer;
    }
  }
  return undefined;
}

export async function requireAdmin(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const token = extractAdminToken(req);
    if (!token) {
      res.status(401).json({ error: 'Authentication required. Please log in.' });
      return;
    }

    const decoded = jwt.verify(token, env.jwtSecret) as {
      id: string;
      email: string;
      role: string;
    };

    const admin = await Admin.findById(decoded.id).select('_id name email role');
    if (!admin) {
      clearAdminSessionCookie(res, req);
      res.status(401).json({ error: 'Admin session is no longer valid.' });
      return;
    }

    req.admin = {
      id: admin._id.toString(),
      email: admin.email,
      name: admin.name,
      role: admin.role,
    };

    next();
  } catch {
    clearAdminSessionCookie(res, req);
    res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }
}
