import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { AlertTriangle, X, MapPin, Clock } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import { rideService } from '../services/rideService';
import DriverInfoCard from '../components/cards/DriverInfoCard';
import { Ride } from '../types';
import { toast } from 'sonner';

interface CancelFormData {
  reason: string;
}

export default function CancelSeatPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { myRides, fetchMyRides, isLoading } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);
  
  const { register, handleSubmit, formState: { isSubmitting, isValid } } = useForm<CancelFormData>({
    mode: 'onChange'
  });

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

  const onSubmit = async () => {
    if (!ride) return;
    try {
      await rideService.leaveRide(ride._id);
      toast.success('Seat released successfully');
      navigate('/journeys');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to cancel seat');
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

  const reasons = [
    "My schedule changed",
    "Found alternative transport",
    "Driver is significantly delayed",
    "Other"
  ];

  return (
    <div className="fixed inset-0 z-100 bg-background flex flex-col font-body-lg overflow-y-auto">
      <header className="w-full sticky top-0 bg-background z-50 py-4 px-5 md:px-8 flex items-center justify-between border-b border-outline-variant/30">
        <div className="text-title-md font-bold tracking-tight text-primary">Shift Carpool</div>
        <button 
          onClick={() => navigate(-1)}
          className="text-on-surface-variant hover:text-primary transition-colors flex items-center gap-2"
        >
          <X size={20} />
          <span className="font-label-caps text-label-caps uppercase">Close</span>
        </button>
      </header>

      <div className="grow flex items-start justify-center p-4 py-8">
        <div className="w-full max-w-2xl bg-surface-container-low border border-outline-variant/30 rounded-xl p-5 md:p-8 shadow-2xl relative">
          
          <div className="mb-6">
            <AlertTriangle className="text-error mb-3 fill-error/20" size={48} />
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Cancel Seat</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Are you sure you want to cancel your reservation for this journey?</p>
          </div>

          <DriverInfoCard name={ride.driverName} phone={ride.driverPhone} className="mb-4" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3 bg-surface-container-low p-3 rounded-lg border border-surface-variant mb-6">
             <div className="flex items-start gap-3">
                <MapPin className="text-outline-variant mt-1" size={16} />
                <div>
                  <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1">Pickup</p>
                  <p className="font-body-sm text-body-sm text-primary">{ride.origin}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-outline-variant mt-1" size={16} />
                <div>
                  <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1">Departure</p>
                  <p className="font-body-sm text-body-sm text-primary">{formattedTime}</p>
                </div>
              </div>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6">
            <div>
              <p className="font-title-md text-title-md text-primary mb-3">Reason for cancellation</p>
              <div className="flex flex-col gap-3">
                {reasons.map((reason, idx) => (
                  <label key={idx} className="flex items-center gap-4 p-3 rounded-lg border border-surface-variant hover:border-outline-variant cursor-pointer transition-colors bg-surface-container-low group">
                    <div className="relative flex items-center justify-center">
                      <input 
                        type="radio" 
                        value={reason} 
                        {...register('reason', { required: true })}
                        className="appearance-none w-5 h-5 border border-outline-variant rounded-full checked:border-primary transition-colors cursor-pointer"
                      />
                      <div className="absolute w-2.5 h-2.5 bg-primary rounded-full scale-0 peer-checked:scale-100 transition-transform pointer-events-none"></div>
                    </div>
                    <span className="font-body-lg text-body-lg text-primary">{reason}</span>
                  </label>
                ))}
              </div>
            </div>

            <p className="font-body-sm text-body-sm text-on-surface-variant italic">
              Cancellation fees may apply depending on timing.
            </p>

            <div className="flex flex-col md:flex-row gap-3 justify-end mt-3">
              <button
                type="button"
                onClick={() => navigate(-1)}
                disabled={isSubmitting}
                className="px-6 py-3 font-body-lg text-body-lg font-medium text-primary bg-transparent border border-outline-variant rounded-full hover:bg-surface-variant transition-colors disabled:opacity-50"
              >
                Keep My Seat
              </button>
              <button
                type="submit"
                disabled={!isValid || isSubmitting}
                className="px-6 py-3 font-body-lg text-body-lg font-medium text-background bg-error rounded-full hover:opacity-90 transition-opacity shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Cancelling...' : 'Confirm Cancellation'}
              </button>
            </div>
          </form>

        </div>
      </div>
    </div>
  );
}
