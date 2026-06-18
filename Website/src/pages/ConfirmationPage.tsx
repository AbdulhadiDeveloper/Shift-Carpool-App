import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { CheckCircle, MessageSquare, ArrowLeft, MapPin, Flag, Clock } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import DriverInfoCard from '../components/cards/DriverInfoCard';
import { Ride } from '../types';

export default function ConfirmationPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { myRides, fetchMyRides, isLoading } = useRides();
  const [ride, setRide] = useState<Ride | null>(null);

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  useEffect(() => {
    if (myRides.length > 0) {
      const found = myRides.find(r => r._id === id);
      if (found) {
        setRide(found);
      } else {
        // Fallback or handle error if ride not found in user's journeys
        navigate('/journeys');
      }
    }
  }, [myRides, id, navigate]);

  if (isLoading || !ride) {
    return (
      <div className="grow flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  const formattedTime = new Date(ride.departureTime).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  const handleWhatsApp = () => {
    const text = `Hi ${ride.driverName}, I just reserved a seat on your ride from ${ride.origin} to ${ride.destination}.`;
    window.open(`https://wa.me/${ride.driverPhone.replace(/\D/g, '')}?text=${encodeURIComponent(text)}`, '_blank');
  };

  return (
    <div className="grow flex items-center justify-center p-4 py-8 relative overflow-hidden">
      {/* Background Effect */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none flex items-center justify-center">
        <div className="w-200 h-200 rounded-full bg-linear-to-tr from-surface-variant to-background blur-[120px]"></div>
      </div>

      <div className="bento-card glass-panel w-full max-w-2xl z-10 flex flex-col items-center text-center p-8 md:p-12 shadow-2xl relative">
        
        {/* Success Icon */}
        <div className="w-24 h-24 rounded-full bg-surface-container flex items-center justify-center mb-6 border border-surface-container-high relative">
          <div className="absolute inset-0 rounded-full bg-primary opacity-5 blur-md"></div>
          <CheckCircle className="text-primary text-5xl fill-primary/20" size={48} />
        </div>

        <h1 className="font-display text-display text-primary tracking-tight mb-3">Seat Reserved Successfully</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8 max-w-md">
          Your journey details have been confirmed. The driver has been notified.
        </p>

        {/* Driver Info */}
        <DriverInfoCard name={ride.driverName} phone={ride.driverPhone} className="w-full text-left mb-6" />

        {/* Trip Summary Box */}
        <div className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg p-6 mb-8 text-left grid grid-cols-1 md:grid-cols-2 gap-6 relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="mt-1"><MapPin className="text-outline-variant" size={20} /></div>
            <div>
              <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1">Pickup</p>
              <p className="font-body-lg text-body-lg text-primary">{ride.origin}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                <Clock size={14} /> {formattedTime}
              </p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="mt-1"><Flag className="text-outline-variant" size={20} /></div>
            <div>
              <p className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1">Dropoff</p>
              <p className="font-body-lg text-body-lg text-primary">{ride.destination}</p>
              <p className="font-body-sm text-body-sm text-on-surface-variant mt-1 flex items-center gap-1">
                <Clock size={14} /> +{ride.estimatedDuration}
              </p>
            </div>
          </div>
        </div>

        {/* WhatsApp CTA */}
        <button
          onClick={handleWhatsApp}
          className="w-full flex items-center justify-center gap-3 bg-primary text-on-primary py-4 px-8 rounded-full font-title-md text-title-md hover:bg-primary-container transition-all duration-300 group mb-6 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 transition-opacity duration-300 pointer-events-none"></div>
          <MessageSquare size={24} className="group-hover:scale-110 transition-transform duration-300" />
          Open WhatsApp Coordinator
        </button>

        {/* Return Link */}
        <Link
          to="/explore"
          className="font-body-lg text-body-lg text-on-surface-variant hover:text-primary transition-colors duration-300 border-b border-transparent hover:border-primary pb-1 inline-flex items-center gap-2"
        >
          <ArrowLeft size={16} /> Return to Dashboard
        </Link>
      </div>
    </div>
  );
}
