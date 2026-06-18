import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapPin, Flag, Calendar, Search, SlidersHorizontal, ArrowRight } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import { rideService } from '../services/rideService';
import RideCard from '../components/cards/RideCard';
import { toast } from 'sonner';

export default function ExplorePage() {
  const { rides, isLoading, fetchRides } = useRides();
  const navigate = useNavigate();
  const [joiningId, setJoiningId] = useState<string | null>(null);

  useEffect(() => {
    fetchRides();
  }, [fetchRides]);

  const handleJoin = async (id: string) => {
    setJoiningId(id);
    try {
      await rideService.joinRide(id);
      toast.success('Seat reserved successfully!');
      navigate(`/confirmed/${id}`);
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to secure seat');
    } finally {
      setJoiningId(null);
    }
  };

  return (
    <div className="grow flex flex-col max-w-7xl mx-auto w-full px-5 md:px-8 py-6 gap-8 relative">
      {/* Header */}
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Curated Journeys</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Discover available seats on verified routes
        </p>
      </div>

      {/* Search & Filter Panel */}
      <div className="glass-panel rounded-xl p-4 flex flex-col md:flex-row gap-4 items-center w-full relative z-10">
        <div className="flex-1 flex items-center bg-background rounded-lg border border-outline-variant px-4 py-3 w-full gap-3 focus-within:border-primary transition-colors">
          <MapPin size={20} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Origin"
            className="bg-transparent border-none outline-none w-full text-primary font-body-lg placeholder:text-on-surface-variant"
          />
          <ArrowRight size={16} className="text-on-surface-variant shrink-0 hidden md:block" />
          <Flag size={20} className="text-on-surface-variant shrink-0 hidden md:block" />
          <input
            type="text"
            placeholder="Destination"
            className="bg-transparent border-none outline-none w-full text-primary font-body-lg placeholder:text-on-surface-variant hidden md:block"
          />
        </div>
        
        <div className="flex-1 flex items-center bg-background rounded-lg border border-outline-variant px-4 py-3 w-full gap-3 focus-within:border-primary transition-colors md:hidden">
          <Flag size={20} className="text-on-surface-variant shrink-0" />
          <input
            type="text"
            placeholder="Destination"
            className="bg-transparent border-none outline-none w-full text-primary font-body-lg placeholder:text-on-surface-variant"
          />
        </div>

        <div className="flex items-center bg-background rounded-lg border border-outline-variant px-4 py-3 w-full md:w-auto gap-3 focus-within:border-primary transition-colors">
          <Calendar size={20} className="text-on-surface-variant shrink-0" />
          <input
            type="date"
            className="bg-transparent border-none outline-none text-primary font-body-lg placeholder:text-on-surface-variant"
          />
        </div>

        <button className="w-full md:w-auto bg-primary text-on-primary px-6 py-3 rounded-lg font-label-caps tracking-widest hover:bg-primary-fixed-dim transition-colors flex items-center justify-center gap-2">
          <Search size={20} />
          FIND ROUTE
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-3 overflow-x-auto pb-3 no-scrollbar relative z-10">
        <button className="bg-surface-variant text-primary px-4 py-2 rounded-full font-label-caps tracking-widest border border-outline-variant hover:border-primary transition-colors whitespace-nowrap shrink-0 flex items-center gap-2">
          <SlidersHorizontal size={16} /> Filters
        </button>
        <button className="bg-primary text-on-primary px-4 py-2 rounded-full font-label-caps tracking-widest border border-primary transition-colors whitespace-nowrap shrink-0">
          Morning Departures
        </button>
        <button className="bg-surface-variant text-primary px-4 py-2 rounded-full font-label-caps tracking-widest border border-outline-variant hover:border-primary transition-colors whitespace-nowrap shrink-0">
          Electric Vehicles Only
        </button>
        <button className="bg-surface-variant text-primary px-4 py-2 rounded-full font-label-caps tracking-widest border border-outline-variant hover:border-primary transition-colors whitespace-nowrap shrink-0">
          Quiet Ride
        </button>
      </div>

      <div className="flex gap-8 relative z-10">
        {/* Map Panel (Decorative) */}
        <div className="hidden lg:block w-1/3 min-w-75 h-150 sticky top-28 rounded-xl overflow-hidden border border-outline-variant">
          <div className="absolute inset-0 bg-[url('https://maps.googleapis.com/maps/api/staticmap?center=37.7749,-122.4194&zoom=12&size=600x1200&maptype=roadmap&style=feature:all|element:labels.text.fill|color:0x8f9194&style=feature:all|element:labels.text.stroke|color:0x141313&style=feature:landscape|color:0x1c1b1b&style=feature:poi|color:0x2a2a2a&style=feature:road|color:0x353434&style=feature:road.highway|color:0x44474a&style=feature:water|color:0x0e0e0e')] bg-cover bg-center opacity-40"></div>
          <div className="absolute inset-0 bg-linear-to-t from-background via-transparent to-transparent opacity-80"></div>
          <div className="absolute bottom-4 left-4 right-4 glass-panel p-4 rounded-lg text-center">
            <span className="font-label-caps text-primary tracking-widest uppercase">Active Region</span>
            <p className="font-body-sm text-on-surface-variant mt-2">San Francisco Bay Area</p>
          </div>
        </div>

        {/* Ride Grid */}
        <div className="flex-1">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[1, 2, 3, 4].map((n) => (
                <div key={n} className="bento-card h-62.5 animate-pulse"></div>
              ))}
            </div>
          ) : rides.length === 0 ? (
            <div className="bento-card text-center py-8">
              <p className="text-on-surface-variant font-body-lg">No journeys found for these criteria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 auto-rows-max">
              {rides.map((ride) => (
                <RideCard
                  key={ride._id}
                  ride={ride}
                  onJoin={handleJoin}
                  isJoining={joiningId === ride._id}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
