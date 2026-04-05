import { cn } from '@/lib/utils';

export default function Badge({
  children,
  variant = 'default',
  className,
  ...props
}) {
  const variants = {
    default: 'bg-space-700 text-space-300',
    free: 'bg-space-700 text-space-400 border border-space-600',
    pro: 'bg-accent/20 text-accent border border-accent/30',
    success: 'bg-green-500/20 text-green-400 border border-green-500/30',
    warning: 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30',
    danger: 'bg-red-500/20 text-red-400 border border-red-500/30',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
