import { cn } from '@/lib/utils';

export default function Input({
  label,
  error,
  className,
  ...props
}) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-space-300 mb-2">
          {label}
        </label>
      )}
      <input
        className={cn(
          'w-full px-4 py-3 bg-space-800 border border-space-700 rounded-xl',
          'text-white placeholder-space-500',
          'focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent',
          'transition-all duration-300',
          error && 'border-red-500 focus:ring-red-500/50',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-2 text-sm text-red-400">{error}</p>
      )}
    </div>
  );
}
