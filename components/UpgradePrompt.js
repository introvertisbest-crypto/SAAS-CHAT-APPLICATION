'use client';

import { useState } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import Button from './ui/Button';
import Card from './ui/Card';

export default function UpgradePrompt() {
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to create checkout session');
        return;
      }

      window.location.href = data.url;
    } catch (error) {
      toast.error('An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="p-6 bg-accent/5 border-accent/20">
      <div className="flex items-start gap-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center ring-1 ring-accent/20">
            <Sparkles className="w-6 h-6 text-accent" />
          </div>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-white mb-2">
            Upgrade to Pro
          </h3>
          <p className="text-sm text-space-300 mb-4">
            Join the conversation! Pro users can send messages and participate in real-time chat.
          </p>
          <ul className="text-sm text-space-300 mb-4 space-y-2">
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              Send unlimited messages
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              Real-time chat access
            </li>
            <li className="flex items-center gap-2">
              <span className="text-accent">✓</span>
              Priority support
            </li>
          </ul>
          <Button 
            onClick={handleUpgrade} 
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Loading...
              </>
            ) : (
              'Upgrade for $9/month'
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
}
