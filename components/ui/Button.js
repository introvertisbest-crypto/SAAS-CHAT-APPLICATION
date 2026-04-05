import { cn } from '@/lib/utils';

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-accent/50 disabled:opacity-50 disabled:cursor-not-allowed active:scale-95';

  const variants = {
    primary: 'bg-accent text-white hover:bg-accent-hover shadow-lg shadow-accent/25',
    secondary: 'bg-space-700 text-white hover:bg-space-600 border border-space-600',
    outline: 'border-2 border-space-600 text-space-300 hover:bg-space-800 hover:border-space-500',
    ghost: 'text-space-300 hover:bg-space-800 hover:text-white',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/50 hover:bg-red-500/30',
  };

  const sizes = {
    sm: 'px-4 py-2 text-sm',
    md: 'px-6 py-2.5 text-base',
    lg: 'px-8 py-3 text-lg',
  };

  return (
    <button
      className={cn(baseStyles, variants[variant], sizes[size], className)}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}
