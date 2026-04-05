import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/Message';

export async function GET() {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    await connectDB();

    const messages = await Message.find()
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const orderedMessages = messages.reverse().map((msg) => ({
      _id: msg._id.toString(),
      email: msg.email,
      content: msg.content,
      createdAt: msg.createdAt,
    }));

    return NextResponse.json({ messages: orderedMessages });
  } catch (error) {
    console.error('Get messages error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}
