import { cn } from '@/lib/utils';

export default function Card({ children, className, ...props }) {
  return (
    <div
      className={cn(
        'bg-space-800 rounded-2xl border border-space-700 shadow-xl',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
