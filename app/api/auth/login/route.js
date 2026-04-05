import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        message: 'Login successful',
        user: {
          id: user._id,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
        },
      },
      { status: 200 }
    );

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      expires,
      path: '/',
    });

    // Also return token in response for localStorage backup
    response.headers.set('X-Token', token);

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
