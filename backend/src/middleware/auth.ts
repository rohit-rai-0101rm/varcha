import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  email: string;
}

export interface AdminPayload {
  adminId: string;
  email: string;
  role: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
      adminAuth?: AdminPayload;
      sessionId?: string;
    }
  }
}

export function attachSession(req: Request, _res: Response, next: NextFunction) {
  req.sessionId = (req.headers['x-session-id'] as string) || undefined;
  next();
}

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorised' });
    return;
  }
  const token = header.slice(7);
  try {
    const secret = process.env.JWT_SECRET!;
    req.auth = jwt.verify(token, secret) as AuthPayload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (header?.startsWith('Bearer ')) {
    try {
      const secret = process.env.JWT_SECRET!;
      req.auth = jwt.verify(header.slice(7), secret) as AuthPayload;
    } catch {
      // token invalid — proceed without auth
    }
  }
  next();
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers['authorization'];
  if (!header?.startsWith('Bearer ')) {
    res.status(401).json({ message: 'Unauthorised' });
    return;
  }
  const token = header.slice(7);
  try {
    const secret = process.env.JWT_SECRET!;
    const payload = jwt.verify(token, secret) as AdminPayload;
    if (!payload.adminId) {
      res.status(403).json({ message: 'Admin access required' });
      return;
    }
    req.adminAuth = payload;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
}
