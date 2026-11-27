import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: number;
      };
    }
  }
}

export function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ error: 'Authentication required' });
    return;
  }

  const token = authHeader.split(' ')[1];
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    res.status(500).json({ error: 'Server authentication is not configured' });
    return;
  }

  try {
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload & {
      userId?: number;
    };

    if (typeof decoded.userId !== 'number') {
      res.status(401).json({ error: 'Invalid token' });
      return;
    }

    req.user = {
      userId: decoded.userId,
    };

    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}