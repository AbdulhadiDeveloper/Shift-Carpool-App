import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, MapPin, Flag, Armchair } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import { rideService } from '../services/rideService';
import StatusBadge from '../components/ui/StatusBadge';
import PassengerCard from '../components/cards/PassengerCard';
import { Ride } from '../types';
import { toast } from 'sonner';

export default function ManageRoutePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { myRides, fetchMyRides, isLoading } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);
  const [cancelling, setCancelling] = useState(false);
  const [completing, setCompleting] = useState(false);

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  useEffect(() => {
    if (myRides.length > 0) {
      const found = myRides.find(r => r._id === id);
      if (found) {
        setRide(found);
      } else {
        navigate('/journeys');
      }
    }
  }, [myRides, id, navigate]);

  const handleCancelRoute = async () => {
    if (!ride || cancelling) return;
    if (!window.confirm('Are you sure you want to cancel this entire route? All passengers will be notified.')) return;
    
    setCancelling(true);
    try {
      await rideService.cancelRide(ride._id);
      toast.success('Route cancelled successfully');
      navigate('/journeys');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel route');
    } finally {
      setCancelling(false);
    }
  };

  const handleCompleteRoute = async () => {
    if (!ride || completing) return;
    
    setCompleting(true);
    try {
      await rideService.completeRide(ride._id);
      toast.success('Route marked as completed!');
      navigate('/journeys');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to complete route');
    } finally {
      setCompleting(false);
    }
  };

  if (isLoading || !ride) {
    return (
      <div className="flex-grow flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const filledSeats = ride.totalSeats - ride.availableSeats;
  const emptySeatsArray = Array.from({ length: ride.availableSeats });

  return (
    <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-5 md:px-8 py-6 gap-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Manage Route</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">Review passengers and manage your active journey</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Route Info */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div className="bento-card">
            <div className="flex items-center justify-between mb-6">
              <StatusBadge status="DRIVING" />
              <div className="flex items-center gap-2 text-on-surface-variant font-label-caps text-label-caps">
                <Clock size={16} />
                <span>IN PROGRESS</span>
              </div>
            </div>

            <div className="relative pl-6 border-l border-outline-variant ml-3 space-y-6 mb-4">
              {/* Origin */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full bg-primary ring-4 ring-surface-container-low"></div>
                <div className="flex items-start gap-3">
                  <MapPin className="text-outline-variant mt-1" size={16} />
                  <div>
                    <p className="font-body-lg text-body-lg text-primary leading-tight">{ride.origin}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">{formattedTime}</p>
                  </div>
                </div>
              </div>

              {/* Destination */}
              <div className="relative">
                <div className="absolute -left-[29px] top-1 w-3 h-3 rounded-full border-2 border-primary bg-surface-container-low ring-4 ring-surface-container-low"></div>
                <div className="flex items-start gap-3">
                  <Flag className="text-outline-variant mt-1" size={16} />
                  <div>
                    <p className="font-body-lg text-body-lg text-primary leading-tight">{ride.destination}</p>
                    <p className="font-body-sm text-body-sm text-on-surface-variant mt-1">+{ride.estimatedDuration}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bento-card flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-surface-variant flex items-center justify-center text-on-surface-variant">
                Car Image
              </div>
              <div>
                <p className="font-body-lg text-body-lg text-primary">Tesla Model 3</p>
                <div className="bg-surface-container px-3 py-1 mt-1 rounded inline-block text-on-surface font-body-sm text-body-sm border border-outline-variant font-mono tracking-wider">
                  XYZ-1234
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 mt-4">
            {ride.status === 'active' && (
              <button
                onClick={handleCompleteRoute}
                disabled={completing}
                className="w-full py-4 bg-primary text-on-primary rounded-lg font-title-md text-title-md hover:opacity-90 transition-opacity duration-200 disabled:opacity-50"
              >
                {completing ? 'Completing...' : 'Mark Route as Completed'}
              </button>
            )}

            <button
              onClick={handleCancelRoute}
              disabled={cancelling}
              className="w-full py-4 border border-error text-error rounded-lg font-title-md text-title-md hover:bg-error-container hover:text-on-error-container transition-colors duration-200 disabled:opacity-50"
            >
              {cancelling ? 'Cancelling...' : 'Cancel Active Route'}
            </button>
          </div>
        </div>

        {/* Right Column: Passengers */}
        <div className="lg:col-span-7 flex flex-col gap-4">
          <h2 className="font-title-md text-title-md text-primary px-1">
            {filledSeats} of {ride.totalSeats} Seats Filled
          </h2>

          <div className="flex flex-col gap-4">
            {ride.passengers.map((p: any, idx: number) => {
              const name = typeof p === 'string' ? `Passenger ${idx + 1}` : p.fullName;
              const phone = typeof p === 'string' ? '' : p.phone;
              return (
                <PassengerCard 
                  key={typeof p === 'string' ? p : p._id} 
                  name={name} 
                  phone={phone}
                  pickupLocation={ride.origin} 
                />
              );
            })}

            {emptySeatsArray.map((_, idx) => (
              <div key={`empty-${idx}`} className="flex items-center justify-center p-4 rounded-lg bg-surface-container-lowest border border-dashed border-outline-variant h-24">
                <div className="flex items-center gap-3 text-on-surface-variant">
                  <Armchair size={24} />
                  <span className="font-body-sm text-body-sm uppercase tracking-widest">Available Seat</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
