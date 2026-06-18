import { useState } from 'react';
import { Clock, Users, ArrowRight, Loader2 } from 'lucide-react';
import { Ride } from '../../types';
import Avatar from '../ui/Avatar';
import RatingBadge from '../ui/RatingBadge';

interface RideCardProps {
  ride: Ride;
  onJoin: (id: string) => Promise<void>;
  isJoining?: boolean;
}

export default function RideCard({ ride, onJoin, isJoining = false }: RideCardProps) {
  const [loading, setLoading] = useState(false);
  const isFull = ride.availableSeats === 0;

  const handleJoin = async () => {
    setLoading(true);
    await onJoin(ride._id);
    setLoading(false);
  };

  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className={`bento-card flex flex-col gap-4 transition-all duration-300 hover:border-primary ${isFull ? 'opacity-80 grayscale' : ''}`}>
      {/* Header: Driver Info & Price */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <Avatar name={ride.driverName} />
          <div>
            <p className="font-title-md text-title-md text-primary font-medium">{ride.driverName}</p>
            <RatingBadge rating={4.9} reviews={12} />
          </div>
        </div>
        <div className="bg-surface-variant px-3 py-2 rounded font-label-caps text-label-caps text-primary border border-outline-variant">
          $12.50
        </div>
      </div>

      {/* Timeline */}
      <div className="flex justify-between items-center my-3">
        <span className="font-label-caps text-label-caps text-on-surface-variant w-16">{formattedTime}</span>
        
        <div className="flex-1 mx-3 relative flex items-center">
          <div className="w-2 h-2 rounded-full bg-primary z-10"></div>
          <div className="h-[1px] bg-outline-variant flex-1"></div>
          <div className="absolute left-1/2 -translate-x-1/2 bg-surface-container-low px-1">
            <Clock size={16} className="text-outline-variant" />
          </div>
          <div className="w-2 h-2 rounded-full border border-primary bg-background z-10"></div>
        </div>
        
        <span className="font-label-caps text-label-caps text-on-surface-variant w-16 text-right">
          +{ride.estimatedDuration}
        </span>
      </div>

      {/* Route Details */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full bg-primary"></div>
          <p className="font-body-lg text-body-lg text-on-surface truncate">{ride.origin}</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-1.5 rounded-full border border-primary"></div>
          <p className="font-body-lg text-body-lg text-on-surface truncate">{ride.destination}</p>
        </div>
      </div>

      {/* Footer & Action */}
      <div className="flex items-center justify-between mt-3 pt-3 border-t border-outline-variant/30">
        <div className="flex items-center gap-3">
          <Users size={16} className="text-on-surface-variant" />
          <span className="font-body-sm text-body-sm text-on-surface-variant">
            {ride.availableSeats} seat{ride.availableSeats !== 1 ? 's' : ''} left
          </span>
        </div>

        {isFull ? (
          <button disabled className="bg-surface-variant text-on-surface-variant px-4 py-3 rounded-lg font-label-caps tracking-widest uppercase border border-outline-variant cursor-not-allowed">
            Fully Booked
          </button>
        ) : (
          <button
            onClick={handleJoin}
            disabled={loading || isJoining}
            className="bg-primary text-on-primary px-4 py-3 rounded-lg font-label-caps tracking-widest uppercase hover:bg-primary-fixed-dim transition-colors flex items-center gap-2 disabled:opacity-50"
          >
            {loading || isJoining ? (
              <Loader2 size={16} className="animate-spin" />
            ) : (
              <>
                Secure Seat <ArrowRight size={16} />
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
