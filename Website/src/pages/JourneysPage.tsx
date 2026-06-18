import { useEffect, useState } from 'react';
import { Route, ChevronDown } from 'lucide-react';
import { useRides } from '../hooks/useRides';
import { useAuth } from '../hooks/useAuth';
import PillToggle from '../components/ui/PillToggle';
import DrivingJourneyCard from '../components/cards/DrivingJourneyCard';
import RidingJourneyCard from '../components/cards/RidingJourneyCard';
import HistoryEntryCard from '../components/cards/HistoryEntryCard';

export default function JourneysPage() {
  const { user } = useAuth();
  const { myRides, fetchMyRides, isLoading } = useRides();
  const [activeTab, setActiveTab] = useState<'UPCOMING' | 'HISTORY'>('UPCOMING');

  useEffect(() => {
    fetchMyRides();
  }, [fetchMyRides]);

  const upcomingRides = myRides.filter(r => r.status === 'active' && new Date(r.departureTime) >= new Date());
  const pastRides = myRides.filter(r => r.status !== 'active' || new Date(r.departureTime) < new Date());

  const drivingUpcoming = upcomingRides.filter(r => r.driverId === user?._id);
  const ridingUpcoming = upcomingRides.filter(r => r.driverId !== user?._id);

  return (
    <div className="grow flex flex-col max-w-7xl mx-auto w-full px-5 md:px-8 py-6 gap-8">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary mb-2">My Journeys</h1>
        <p className="font-body-lg text-body-lg text-on-surface-variant">
          Manage your upcoming shared routes and view your history
        </p>
      </div>

      <PillToggle activeTab={activeTab} onChange={setActiveTab} />

      {isLoading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : activeTab === 'UPCOMING' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
          {drivingUpcoming.length === 0 && ridingUpcoming.length === 0 && (
            <div className="lg:col-span-12 bento-card text-center py-8">
              <p className="text-on-surface-variant font-body-lg">You have no upcoming journeys.</p>
            </div>
          )}

          {drivingUpcoming.map(ride => (
            <div key={ride._id} className="lg:col-span-6 xl:col-span-4">
              <DrivingJourneyCard ride={ride} />
            </div>
          ))}

          {ridingUpcoming.map(ride => (
            <div key={ride._id} className="lg:col-span-6 xl:col-span-4">
              <RidingJourneyCard ride={ride} />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Stats Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 flex flex-col justify-between min-h-50">
              <div className="flex items-center gap-2 text-on-surface-variant">
                <Route size={20} />
                <span className="font-label-caps text-label-caps tracking-widest uppercase">Total Journeys</span>
              </div>
              <div className="font-display text-display text-primary mt-3">{pastRides.length}</div>
              
              <div className="mt-auto pt-4">
                <div className="flex justify-between font-label-caps text-label-caps mb-1">
                  <span className="text-primary">Driving</span>
                  <span className="text-tertiary-fixed-dim">Riding</span>
                </div>
                <div className="h-2 w-full bg-surface-variant rounded-full overflow-hidden flex">
                  <div className="bg-primary h-full w-[65%]"></div>
                  <div className="bg-tertiary-fixed-dim h-full w-[35%] opacity-50"></div>
                </div>
              </div>
            </div>

            {/* Carbon Card (Decorative) */}
            <div className="bg-surface-container-low rounded-xl p-5 border border-outline-variant/30 relative overflow-hidden group min-h-40 flex flex-col justify-end">
              <div className="absolute inset-0 bg-cover bg-center w-full h-full opacity-30 group-hover:opacity-40 transition-opacity duration-500 bg-[url('https://images.unsplash.com/photo-1518005020951-eccb494ad742?auto=format&fit=crop&q=80&w=800')]"></div>
              <div className="relative z-10">
                <h3 className="font-title-md text-title-md text-primary mb-1">Carbon Offset</h3>
                <p className="font-body-sm text-body-sm text-on-surface">You've contributed to a cleaner city</p>
              </div>
            </div>
          </div>

          {/* History List */}
          <div className="lg:col-span-8 flex flex-col gap-3">
            {pastRides.length === 0 ? (
              <div className="bento-card text-center py-8 h-full flex flex-col justify-center">
                <p className="text-on-surface-variant font-body-lg">Your journey history is empty.</p>
              </div>
            ) : (
              <>
                {pastRides.map(ride => (
                  <HistoryEntryCard key={ride._id} ride={ride} />
                ))}
                {pastRides.length > 5 && (
                  <div className="flex justify-center mt-4">
                    <button className="font-label-caps text-label-caps text-on-surface-variant hover:text-primary transition-colors flex items-center space-x-2 py-3 px-4 border border-outline-variant/50 rounded-full hover:bg-surface-variant">
                      <span>LOAD MORE</span>
                      <ChevronDown size={16} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
