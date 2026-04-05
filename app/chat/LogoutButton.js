'use client';

import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { LogOut } from 'lucide-react';
import Button from '@/components/ui/Button';

export default function LogoutButton() {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/me', {
        method: 'DELETE',
      });

      if (response.ok) {
        toast.success('Logged out successfully');
        router.push('/login');
        router.refresh();
      } else {
        toast.error('Logout failed');
      }
    } catch (error) {
      toast.error('An error occurred');
    }
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="gap-2 text-space-400 hover:text-white hover:bg-space-700"
    >
      <LogOut className="w-4 h-4" />
      <span className="hidden sm:inline">Logout</span>
    </Button>
  );
}
