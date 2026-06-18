import { Ride } from '../../types';
import StatusBadge from '../ui/StatusBadge';
import { useAuth } from '../../hooks/useAuth';

interface HistoryEntryCardProps {
  ride: Ride;
}

export default function HistoryEntryCard({ ride }: HistoryEntryCardProps) {
  const { user } = useAuth();
  const isDriver = ride.driverId === user?._id;
  const wasCancelled = ride.status === 'cancelled';
  
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
      
      <div>
        <StatusBadge status={wasCancelled ? 'CANCELLED' : 'COMPLETED'} />
      </div>
    </div>
  );
}
