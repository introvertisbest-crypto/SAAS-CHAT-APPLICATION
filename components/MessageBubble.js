import { formatRelativeTime } from '@/lib/utils';

export default function MessageBubble({ message, isOwnMessage }) {
  return (
    <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}>
      <div className={`max-w-[70%] ${isOwnMessage ? 'order-2' : 'order-1'}`}>
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xs font-medium text-space-300">
            {message.email}
          </span>
          <span className="text-xs text-space-500">
            {formatRelativeTime(message.createdAt)}
          </span>
        </div>
        <div
          className={`px-4 py-2.5 rounded-2xl ${
            isOwnMessage
              ? 'bg-accent text-white rounded-tr-sm'
              : 'bg-space-700 text-white rounded-tl-sm'
          }`}
        >
          <p className="text-sm whitespace-pre-wrap break-words leading-relaxed">
            {message.content}
          </p>
        </div>
      </div>
    </div>
  );
}
