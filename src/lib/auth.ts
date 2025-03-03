// lib/auth.ts
import jwt from 'jsonwebtoken';

export const verifyToken = (token: string) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!);
  } catch (error:any) {
    return error;
  }
};

export const isAuthenticated = (req) => {
  const token = req.headers.authorization?.split(' ')[1];

  if (!token) {
    return null;
  }

  return verifyToken(token);
};
