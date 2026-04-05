import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import connectDB from '@/lib/db';
import User from '@/models/User';
import { generateToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password } = await request.json();
    console.log('📝 Registration attempt:', email);

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    console.log('🔌 Connecting to DB...');
    await connectDB();
    console.log('✅ DB connected');

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      console.log('⚠️ User already exists:', email);
      return NextResponse.json(
        { error: 'User with this email already exists' },
        { status: 409 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    console.log('🔐 Password hashed');

    const user = await User.create({
      email: email.toLowerCase(),
      password: hashedPassword,
      subscriptionTier: 'free',
    });

    console.log('✅ User created:', user.email, 'ID:', user._id.toString());

    const token = generateToken(user._id.toString());

    const response = NextResponse.json(
      {
        message: 'User registered successfully',
        user: {
          id: user._id,
          email: user.email,
          subscriptionTier: user.subscriptionTier,
        },
      },
      { status: 201 }
    );

    const expires = new Date();
    expires.setDate(expires.getDate() + 7);

    response.cookies.set('token', token, {
      httpOnly: false,
      secure: true,
      sameSite: 'lax',
      expires: expires,
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
