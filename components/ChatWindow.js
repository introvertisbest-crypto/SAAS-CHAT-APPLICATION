'use client';

import { useState, useEffect, useRef } from 'react';
import Pusher from 'pusher-js';
import { Send, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import MessageBubble from './MessageBubble';
import Input from './ui/Input';
import Button from './ui/Button';

export default function ChatWindow({ user, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [newMessage, setNewMessage] = useState('');
  const [isConnected, setIsConnected] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);
  const isPro = user?.subscriptionTier === 'pro';
  const pusherRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    // Initialize Pusher
    const pusher = new Pusher(process.env.NEXT_PUBLIC_PUSHER_KEY, {
      cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER || 'mt1',
      forceTLS: true,
    });

    pusherRef.current = pusher;

    pusher.connection.bind('connected', () => {
      console.log('✅ Connected to Pusher');
      setIsConnected(true);
    });

    pusher.connection.bind('disconnected', () => {
      console.log('❌ Disconnected from Pusher');
      setIsConnected(false);
    });

    pusher.connection.bind('error', (err) => {
      console.error('❌ Pusher error:', err);
    });

    // Subscribe to chat channel
    const channel = pusher.subscribe('chat');
    
    channel.bind('new-message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    return () => {
      pusher.unsubscribe('chat');
      pusher.disconnect();
    };
  }, []);

  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!newMessage.trim() || !isPro) {
      return;
    }

    setIsSending(true);

    try {
      const response = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newMessage.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to send message');
        return;
      }

      setNewMessage('');
    } catch (error) {
      toast.error('Failed to send message');
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-space-900/50">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full text-space-500">
            <p>No messages yet. Be the first to say hello!</p>
          </div>
        ) : (
          messages.map((message) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwnMessage={message.email === user?.email}
            />
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="border-t border-space-700 p-4 bg-space-800">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            type="text"
            placeholder={
              isPro
                ? isConnected 
                  ? 'Type a message...'
                  : 'Connecting...'
                : 'Upgrade to Pro to send messages'
            }
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            disabled={!isPro || isSending || !isConnected}
            className="flex-1"
            maxLength={1000}
          />
          <Button
            type="submit"
            disabled={!isPro || !newMessage.trim() || isSending || !isConnected}
            className="px-4 bg-accent hover:bg-accent-hover"
          >
            {isSending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Send className="w-5 h-5" />
            )}
          </Button>
        </form>
        {!isPro && (
          <p className="text-xs text-space-500 mt-2">
            You have read-only access. Upgrade to Pro to participate.
          </p>
        )}
      </div>
    </div>
  );
}
