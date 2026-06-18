import { Star } from 'lucide-react';

interface RatingBadgeProps {
  rating?: number;
  reviews?: number;
  className?: string;
}

export default function RatingBadge({ rating = 5.0, reviews, className = '' }: RatingBadgeProps) {
  return (
    <div className={`flex items-center gap-1 ${className}`}>
      <Star size={16} className="text-primary fill-primary" />
      <span className="font-label-caps text-label-caps text-primary tracking-wider">{rating.toFixed(1)}</span>
      {reviews !== undefined && (
        <span className="font-body-sm text-body-sm text-on-surface-variant ml-2">
          ({reviews} Reviews)
        </span>
      )}
    </div>
  );
}
