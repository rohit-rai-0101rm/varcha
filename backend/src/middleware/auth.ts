import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthPayload {
  userId: string;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      auth?: AuthPayload;
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
