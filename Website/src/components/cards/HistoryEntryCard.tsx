import { useState } from 'react';
import { Star } from 'lucide-react';
import { toast } from 'sonner';
import { Ride } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../hooks/useAuth';
import { rideService } from '../../services/rideService';

interface HistoryEntryCardProps {
  ride: Ride;
}

export default function HistoryEntryCard({ ride }: HistoryEntryCardProps) {
  const { user } = useAuth();
  const isDriver = ride.driverId === user?._id;
  const wasCancelled = ride.status === 'cancelled';
  const isCompleted = ride.status === 'completed';

  const [ratingValue, setRatingValue] = useState(0);
  const [hoverValue, setHoverValue] = useState(0);
  const [isRated, setIsRated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleRate = async (score: number) => {
    if (isSubmitting || isRated) return;
    setIsSubmitting(true);
    try {
      await rideService.rateRide(ride._id, score);
      setIsRated(true);
      setRatingValue(score);
      toast.success('Rating submitted successfully!');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to submit rating');
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const formattedDate = new Date(ride.departureTime).toLocaleDateString([], {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className={`bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 hover:bg-surface-container transition-colors duration-300 cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 mb-3 ${wasCancelled ? 'opacity-75 hover:opacity-100' : ''}`}>
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <div className="flex items-center gap-3 mb-1">
            <span className="px-3 py-px rounded-sm bg-surface-variant text-on-surface-variant font-label-caps text-label-caps tracking-wider border border-outline-variant/30">
              {isDriver ? 'DRIVING' : 'RIDING'}
            </span>
            <span className="font-label-caps text-label-caps text-on-surface-variant">{formattedDate}</span>
          </div>
          <p className="font-body-lg text-body-lg text-primary">{ride.origin} → {ride.destination}</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">
            {isDriver ? `${ride.passengers.length} passengers` : `Driver: ${ride.driverName}`}
          </p>
        </div>
      </div>
      
      <div className="flex flex-col items-end">
        <StatusBadge status={wasCancelled ? 'CANCELLED' : 'COMPLETED'} />
        
        {isCompleted && !isDriver && !isRated && (
          <div className="mt-4 flex flex-col items-end gap-1" onClick={(e) => e.stopPropagation()}>
            <span className="font-label-caps text-label-caps text-on-surface-variant">Rate Driver</span>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  disabled={isSubmitting}
                  onClick={() => handleRate(star)}
                  onMouseEnter={() => setHoverValue(star)}
                  onMouseLeave={() => setHoverValue(0)}
                  className="transition-transform hover:scale-110 disabled:opacity-50"
                >
                  <Star
                    size={20}
                    className={`${
                      (hoverValue || ratingValue) >= star
                        ? 'text-primary fill-primary'
                        : 'text-outline-variant'
                    }`}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
