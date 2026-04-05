'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Crown, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function UpgradeButton() {
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
    <Button
      onClick={handleUpgrade}
      disabled={isLoading}
      size="sm"
      className="gap-2 bg-accent hover:bg-accent-hover"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Loading...</span>
        </>
      ) : (
        <>
          <Crown className="w-4 h-4" />
          <span className="hidden sm:inline">Upgrade to Pro</span>
        </>
      )}
    </Button>
  );
}
