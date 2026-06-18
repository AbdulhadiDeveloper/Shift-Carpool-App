import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ride } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import Avatar from '../ui/Avatar';

interface DrivingJourneyCardProps {
  ride: Ride;
}

export default function DrivingJourneyCard({ ride }: DrivingJourneyCardProps) {
  const navigate = useNavigate();
  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bento-card">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status="DRIVING" />
        <div className="bg-surface-container-high text-on-surface font-body-sm text-body-sm py-1 px-3 rounded-full border border-outline-variant flex items-center gap-1">
          <Clock size={14} /> {formattedTime}
        </div>
      </div>

      <div className="flex items-start gap-4 mb-4">
        <div className="flex flex-col items-center mt-1">
          <div className="w-3 h-3 rounded-full bg-primary"></div>
          <div className="w-0.5 h-8 bg-outline-variant my-1"></div>
          <div className="w-3 h-3 rounded-full border-2 border-primary bg-background"></div>
        </div>
        <div className="flex flex-col justify-between h-full space-y-4">
          <p className="font-body-lg text-body-lg text-primary truncate">{ride.origin}</p>
          <p className="font-body-lg text-body-lg text-primary truncate">{ride.destination}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mt-4 pt-4 border-t border-outline-variant/30">
        <div className="flex -space-x-2">
          {ride.passengers.map((_, i) => (
            i < 3 ? <Avatar key={i} name={`Passenger ${i}`} size="md" className="border-2 border-surface-container-low" /> : null
          ))}
          {ride.passengers.length > 3 && (
            <div className="w-10 h-10 rounded-full border-2 border-surface-container-low bg-surface-variant flex items-center justify-center text-body-sm font-body-sm text-on-surface-variant z-10 relative">
              +{ride.passengers.length - 3}
            </div>
          )}
          {ride.passengers.length === 0 && (
            <span className="text-body-sm text-on-surface-variant">No passengers yet</span>
          )}
        </div>
        
        <button
          onClick={() => navigate(`/manage/${ride._id}`)}
          className="bg-primary text-on-primary font-body-sm text-body-sm py-3 px-4 rounded-lg hover:bg-primary-fixed-dim transition-colors"
        >
          Manage Route
        </button>
      </div>
    </div>
  );
}
