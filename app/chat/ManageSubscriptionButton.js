'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CreditCard, Loader2 } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function ManageSubscriptionButton() {
  const [isLoading, setIsLoading] = useState(false);

  const handleManage = async () => {
    setIsLoading(true);

    try {
      const response = await fetch('/api/stripe/portal', {
        method: 'POST',
      });

      const data = await response.json();

      if (!response.ok) {
        toast.error(data.error || 'Failed to open billing portal');
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
      variant="outline"
      onClick={handleManage}
      disabled={isLoading}
      size="sm"
      className="gap-2 border-space-600 text-space-300 hover:bg-space-700 hover:text-white"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="hidden sm:inline">Loading...</span>
        </>
      ) : (
        <>
          <CreditCard className="w-4 h-4" />
          <span className="hidden sm:inline">Manage</span>
        </>
      )}
    </Button>
  );
}
