import { cn } from '@/lib/utils';

interface RankBadgeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function RankBadge({ score, size = 'md', className }: RankBadgeProps) {
  // Color based on score tier
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'bg-green-500/10 text-green-600 border-green-500/20';
    if (score >= 60) return 'bg-blue-500/10 text-blue-600 border-blue-500/20';
    if (score >= 40) return 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20';
    if (score >= 20) return 'bg-orange-500/10 text-orange-600 border-orange-500/20';
    return 'bg-red-500/10 text-red-600 border-red-500/20';
  };

  const sizeClasses = {
    sm: 'text-xs px-1.5 py-0.5',
    md: 'text-sm px-2 py-1',
    lg: 'text-base px-3 py-1.5',
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-semibold rounded border',
        getScoreColor(score),
        sizeClasses[size],
        className
      )}
    >
      {score.toFixed(1)}
    </span>
  );
}
