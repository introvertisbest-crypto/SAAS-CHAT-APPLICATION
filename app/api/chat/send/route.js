import { NextResponse } from 'next/server';
import { getCurrentUser } from '@/lib/auth';
import { pusherServer } from '@/lib/pusher';
import connectDB from '@/lib/db';
import Message from '@/models/Message';

export const dynamic = 'force-dynamic';

export async function POST(request) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Not authenticated' },
        { status: 401 }
      );
    }

    if (user.subscriptionTier !== 'pro') {
      return NextResponse.json(
        { error: 'Only Pro users can send messages' },
        { status: 403 }
      );
    }

    const { content } = await request.json();

    if (!content || content.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message cannot be empty' },
        { status: 400 }
      );
    }

    if (content.length > 1000) {
      return NextResponse.json(
        { error: 'Message too long (max 1000 characters)' },
        { status: 400 }
      );
    }

    await connectDB();
    
    const message = await Message.create({
      userId: user._id,
      email: user.email,
      content: content.trim(),
    });

    const messageData = {
      _id: message._id.toString(),
      email: message.email,
      content: message.content,
      createdAt: message.createdAt,
    };

    // Trigger Pusher event
    await pusherServer.trigger('chat', 'new-message', messageData);

    return NextResponse.json({ success: true, message: messageData });
  } catch (error) {
    console.error('Send message error:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}
