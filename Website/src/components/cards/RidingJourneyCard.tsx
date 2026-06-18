import { Clock } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Ride } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import Avatar from '../ui/Avatar';

interface RidingJourneyCardProps {
  ride: Ride;
}

export default function RidingJourneyCard({ ride }: RidingJourneyCardProps) {
  const navigate = useNavigate();
  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="bento-card">
      <div className="flex justify-between items-start mb-4">
        <StatusBadge status="RIDING" />
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
        <div className="flex items-center gap-3">
          <Avatar name={ride.driverName} size="md" />
          <div>
            <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest">Driver</p>
            <p className="font-body-sm text-body-sm text-primary">{ride.driverName}</p>
          </div>
        </div>
        
        <button
          onClick={() => navigate(`/cancel/${ride._id}`)}
          className="border border-outline-variant text-primary font-body-sm text-body-sm py-2 px-3 rounded-lg hover:bg-surface-variant transition-colors"
        >
          Cancel Seat
        </button>
      </div>
    </div>
  );
}
