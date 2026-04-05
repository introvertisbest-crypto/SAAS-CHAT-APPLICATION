import Badge from './ui/Badge';
import { Crown, Zap } from 'lucide-react';

export default function PlanBadge({ tier }) {
  if (tier === 'pro') {
    return (
      <Badge variant="pro" className="gap-1.5">
        <Crown className="w-3 h-3" />
        Pro
      </Badge>
    );
  }

  return (
    <Badge variant="free" className="gap-1.5">
      <Zap className="w-3 h-3" />
      Free
    </Badge>
  );
}
