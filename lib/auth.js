import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import connectDB from './db';
import User from '@/models/User';

const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
  throw new Error('Please define the JWT_SECRET environment variable inside .env');
}

export function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    return user;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
}

export async function verifyUserFromToken(token) {
  try {
    const decoded = verifyToken(token);
    if (!decoded) {
      return null;
    }

    await connectDB();
    const user = await User.findById(decoded.userId).select('-password');
    
    return user;
  } catch (error) {
    console.error('Error verifying user from token:', error);
    return null;
  }
}
