import { useState, useEffect } from 'react';
import { Pencil, MapPin, CreditCard, Shield, Bell, ChevronRight, SlidersHorizontal, LogOut } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useRides } from '../hooks/useRides';
import Avatar from '../components/ui/Avatar';
import RatingBadge from '../components/ui/RatingBadge';
import { Link } from 'react-router-dom';

export default function ProfilePage() {
  const { user, logout } = useAuth();
  const { myRides, fetchMyRides } = useRides();
  const [preferences, setPreferences] = useState({
    quietMode: true,
    bgMusic: false,
    climate: 'Cool' // Cool, Neutral, Warm
  });

  useEffect(() => {
    fetchMyRides();
    
    // Load preferences from local storage if any
    const saved = localStorage.getItem('shift_preferences');
    if (saved) {
      try {
        setPreferences(JSON.parse(saved));
      } catch (e) {
        // ignore
      }
    }
  }, [fetchMyRides]);

  const updatePreference = (key: keyof typeof preferences, value: any) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    localStorage.setItem('shift_preferences', JSON.stringify(newPrefs));
  };

  if (!user) return null;

  const pastRidesCount = myRides.filter(r => r.status !== 'active' || new Date(r.departureTime) < new Date()).length;
  const memberSince = '2024';

  return (
    <div className="flex-grow flex flex-col max-w-7xl mx-auto w-full px-5 md:px-8 py-6 gap-6">
      
      {/* Profile Header Section */}
      <div className="bg-surface-container-low rounded-xl border border-surface-variant p-6 flex flex-col md:flex-row items-center md:items-start gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-surface-variant rounded-full mix-blend-screen filter blur-[80px] opacity-30 pointer-events-none"></div>
        
        <div className="relative w-32 h-32 shrink-0">
          <Avatar name={user.fullName} size="xl" className="w-full h-full text-display border-2 border-surface-variant" />
          <button className="absolute bottom-0 right-0 bg-surface-variant text-primary p-3 rounded-full border border-outline-variant hover:bg-surface-bright transition-colors">
            <Pencil size={16} />
          </button>
        </div>

        <div className="flex flex-col items-center md:items-start text-center md:text-left z-10 w-full">
          <h1 className="font-headline-lg text-headline-lg text-primary">{user.fullName}</h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant mt-1">
            Member since {memberSince} • {pastRidesCount} Journeys
          </p>
          
          <div className="mt-4 flex flex-wrap items-center justify-center md:justify-start gap-4 w-full">
            <div className="flex items-center gap-3 bg-surface rounded-full px-4 py-3 border border-surface-variant">
               <RatingBadge rating={5.0} reviews={24} />
            </div>
            
            <button className="w-full md:w-auto px-6 py-4 bg-transparent border border-outline-variant text-primary font-label-caps text-label-caps rounded-full hover:bg-surface-variant transition-colors uppercase tracking-widest ml-auto">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="md:col-span-7 flex flex-col gap-6">
          
          {/* Personal Details Card */}
          <div className="bento-card">
            <h2 className="font-title-md text-title-md text-primary mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1 block">Email</label>
                <div className="font-body-lg text-body-lg text-on-surface bg-surface rounded-lg p-3 border border-surface-variant flex justify-between items-center">
                  <span>{user.email}</span>
                  <button className="text-primary font-body-sm text-body-sm hover:underline">Verify</button>
                </div>
              </div>
              <div>
                <label className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1 block">Phone Number</label>
                <div className="font-body-lg text-body-lg text-on-surface bg-surface rounded-lg p-3 border border-surface-variant">
                  {user.phone}
                </div>
              </div>
              <div>
                <label className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1 block">Home Location</label>
                <div className="font-body-lg text-body-lg text-on-surface bg-surface rounded-lg p-3 border border-surface-variant flex items-center gap-3">
                  <MapPin size={18} className="text-on-surface-variant" />
                  Add your home address
                </div>
              </div>
            </div>
          </div>

          {/* Ride Preferences Card */}
          <div className="bento-card">
            <div className="flex items-center gap-3 mb-4">
              <SlidersHorizontal className="text-primary" size={24} />
              <h2 className="font-title-md text-title-md text-primary">Ride Preferences</h2>
            </div>
            
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-lg text-body-lg text-primary">Quiet Mode</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Prefer limited conversation during rides</p>
                </div>
                
                {/* Custom Toggle CSS implemented inline for simplicity */}
                <label className="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer">
                  <input type="checkbox" checked={preferences.quietMode} onChange={(e) => updatePreference('quietMode', e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer opacity-0 z-10" />
                  <div className={`block h-6 rounded-full transition-colors ${preferences.quietMode ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                  <div className={`absolute left-1 top-1 bg-surface-container-low w-4 h-4 rounded-full transition-transform ${preferences.quietMode ? 'transform translate-x-6 bg-on-primary' : 'bg-on-surface-variant'}`}></div>
                </label>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="font-body-lg text-body-lg text-primary">Background Music</p>
                  <p className="font-body-sm text-body-sm text-on-surface-variant">Open to driver's choice of music</p>
                </div>
                <label className="relative inline-block w-12 mr-2 align-middle select-none cursor-pointer">
                  <input type="checkbox" checked={preferences.bgMusic} onChange={(e) => updatePreference('bgMusic', e.target.checked)} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer opacity-0 z-10" />
                  <div className={`block h-6 rounded-full transition-colors ${preferences.bgMusic ? 'bg-primary' : 'bg-surface-variant'}`}></div>
                  <div className={`absolute left-1 top-1 bg-surface-container-low w-4 h-4 rounded-full transition-transform ${preferences.bgMusic ? 'transform translate-x-6 bg-on-primary' : 'bg-on-surface-variant'}`}></div>
                </label>
              </div>

              <div>
                <p className="font-body-lg text-body-lg text-primary mb-3">Climate Preference</p>
                <div className="flex gap-3">
                  {['Cool', 'Neutral', 'Warm'].map((c) => (
                    <button
                      key={c}
                      onClick={() => updatePreference('climate', c)}
                      className={`flex-1 py-3 rounded-lg font-body-sm text-body-sm transition-colors ${
                        preferences.climate === c
                          ? 'border-2 border-primary bg-surface text-primary'
                          : 'border border-surface-variant text-on-surface-variant hover:border-outline'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="md:col-span-5 flex flex-col gap-6">
          
          {/* Action Card */}
          <div className="bento-card bg-surface-variant border-none text-center">
             <p className="font-body-lg text-body-lg text-primary mb-4">Driving somewhere?</p>
             <Link to="/broadcast" className="inline-block bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps text-label-caps transition-colors duration-300 hover:bg-primary-fixed-dim uppercase tracking-widest">
                Broadcast Route
             </Link>
          </div>

          {/* Account Settings Card */}
          <div className="bento-card p-0 overflow-hidden">
            <h2 className="font-title-md text-title-md text-primary p-4 pb-2">Account Settings</h2>
            
            <div className="flex flex-col">
              <button className="flex items-center justify-between p-4 hover:bg-surface transition-colors group">
                <div className="flex items-center gap-4">
                  <CreditCard className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
                  <span className="font-body-lg text-body-lg text-primary">Payment Methods</span>
                </div>
                <ChevronRight className="text-outline-variant" size={20} />
              </button>
              <div className="h-[1px] bg-surface-variant w-full"></div>
              
              <button className="flex items-center justify-between p-4 hover:bg-surface transition-colors group">
                <div className="flex items-center gap-4">
                  <Shield className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
                  <span className="font-body-lg text-body-lg text-primary">Privacy & Security</span>
                </div>
                <ChevronRight className="text-outline-variant" size={20} />
              </button>
              <div className="h-[1px] bg-surface-variant w-full"></div>
              
              <button className="flex items-center justify-between p-4 hover:bg-surface transition-colors group">
                <div className="flex items-center gap-4">
                  <Bell className="text-on-surface-variant group-hover:text-primary transition-colors" size={20} />
                  <span className="font-body-lg text-body-lg text-primary">Notifications</span>
                </div>
                <ChevronRight className="text-outline-variant" size={20} />
              </button>
            </div>
          </div>

          <button onClick={logout} className="flex items-center justify-center gap-3 p-4 w-full rounded-xl border border-error/30 text-error hover:bg-error-container hover:text-on-error-container transition-colors font-body-lg">
            <LogOut size={20} />
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}
