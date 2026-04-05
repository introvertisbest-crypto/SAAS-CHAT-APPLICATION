import { redirect } from 'next/navigation';
import { Crown, MessageCircle } from 'lucide-react';
import { unstable_noStore } from 'next/cache';
import { getCurrentUser } from '@/lib/auth';
import connectDB from '@/lib/db';
import Message from '@/models/Message';
import Card from '@/components/ui/Card';
import PlanBadge from '@/components/PlanBadge';
import UpgradePrompt from '@/components/UpgradePrompt';
import ChatWindow from '@/components/ChatWindow';
import LogoutButton from './LogoutButton';
import UpgradeButton from './UpgradeButton';
import ManageSubscriptionButton from './ManageSubscriptionButton';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function ChatPage() {
  unstable_noStore();
  
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login');
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
    createdAt: msg.createdAt.toISOString(),
  }));

  const isPro = user.subscriptionTier === 'pro';

  return (
    <div className="min-h-screen bg-space-900">
      {/* Glassmorphism Header */}
      <header className="sticky top-0 z-50 glass border-b border-space-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-accent/10 rounded-xl flex items-center justify-center ring-1 ring-accent/20">
                <MessageCircle className="w-5 h-5 text-accent" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white tracking-tight">SaaS Chat</h1>
                <p className="text-xs text-space-400">Real-time messaging</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-3 text-sm">
                <span className="text-space-300">{user.email}</span>
                <PlanBadge tier={user.subscriptionTier} />
              </div>

              {isPro && user.stripeCustomerId && (
                <ManageSubscriptionButton />
              )}

              {!isPro && <UpgradeButton />}

              <LogoutButton />
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <Card className="h-[calc(100vh-12rem)] flex flex-col overflow-hidden">
              <div className="border-b border-space-700 p-4 bg-space-800/50">
                <h2 className="text-lg font-semibold text-white">
                  Global Chat Room
                </h2>
                <p className="text-sm text-space-400">
                  {isPro
                    ? 'You can send and receive messages in real-time'
                    : 'Read-only access - upgrade to Pro to participate'}
                </p>
              </div>
              <ChatWindow
                user={{
                  email: user.email,
                  subscriptionTier: user.subscriptionTier,
                }}
                initialMessages={orderedMessages}
              />
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-white mb-4">
                Your Account
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-space-400 mb-1">Email</p>
                  <p className="font-medium text-white">{user.email}</p>
                </div>
                <div>
                  <p className="text-sm text-space-400 mb-1">Plan</p>
                  <div className="mt-1">
                    <PlanBadge tier={user.subscriptionTier} />
                  </div>
                </div>
              </div>
            </Card>

            {!isPro && <UpgradePrompt />}

            {isPro && (
              <Card className="p-6 bg-accent/5 border-accent/20">
                <div className="flex items-center gap-2 mb-3">
                  <Crown className="w-5 h-5 text-accent" />
                  <h3 className="text-lg font-semibold text-white">
                    Pro Member
                  </h3>
                </div>
                <p className="text-sm text-space-300">
                  You have full access to all chat features. Thank you for your support!
                </p>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
