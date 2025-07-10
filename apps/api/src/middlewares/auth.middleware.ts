import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret';

/**
 * Middleware to check if the user is authenticated
 * @param req - The request object
 * @param res - The response object
 * @param next - The next function
 * @returns - The next function
 */
export async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: 'No token provided' });
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as {
      sub: string;
      username: string;
    };
    (req as any).userId = decoded.sub;
    next();
  } catch {
    return res.status(401).json({ error: 'Invalid token' });
  }
}
