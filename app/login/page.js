'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'sonner';
import { LogIn, Loader2, MessageCircle } from 'lucide-react';
import Card from '@/components/ui/Card';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: '' }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          setErrors({ password: data.error });
        } else {
          toast.error(data.error || 'Login failed');
        }
        return;
      }

      const token = response.headers.get('X-Token');
      if (token) {
        localStorage.setItem('token', token);
      }

      toast.success('Login successful!');
      router.push('/chat');
      router.refresh();
    } catch (error) {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 md:p-6 lg:p-8 bg-space-900">
      <div className="w-full max-w-md animate-fade-in">
        <Card className="p-8 md:p-10">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-accent/10 rounded-2xl mb-6 ring-1 ring-accent/20">
              <MessageCircle className="w-8 h-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2 tracking-tight">Welcome Back</h1>
            <p className="text-space-300 text-base">Sign in to continue chatting</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <Input
              type="email"
              name="email"
              label="Email"
              placeholder="you@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              required
              autoComplete="email"
            />

            <Input
              type="password"
              name="password"
              label="Password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              required
              autoComplete="current-password"
            />

            <Button
              type="submit"
              className="w-full mt-2"
              size="lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <LogIn className="w-5 h-5 mr-2" />
                  Sign In
                </>
              )}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-space-700 text-center">
            <p className="text-sm text-space-400">
              Don&apos;t have an account?{' '}
              <Link
                href="/register"
                className="font-semibold text-accent hover:text-accent-light transition-colors"
              >
                Create one
              </Link>
            </p>
          </div>
        </Card>

        <p className="text-center mt-8 text-sm text-space-500">
          Secure, real-time messaging for teams
        </p>
      </div>
    </div>
  );
}
