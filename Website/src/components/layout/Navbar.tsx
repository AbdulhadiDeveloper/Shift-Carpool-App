import { Link, useLocation } from 'react-router-dom';
import { Menu, LogOut } from 'lucide-react';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <nav className="bg-surface-container-low w-full sticky top-0 z-50 border-b border-outline-variant/30">
      <div className="flex justify-between items-center h-20 px-5 md:px-8 max-w-7xl mx-auto">
        {/* Brand */}
        <Link to="/explore" className="text-title-md font-bold tracking-tight text-primary">
          Shift Carpool
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex gap-6 items-center">
          <Link
            to="/explore"
            className={`font-body-lg ${
              location.pathname === '/explore'
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-300'
            }`}
          >
            Explore
          </Link>
          <Link
            to="/journeys"
            className={`font-body-lg ${
              location.pathname === '/journeys'
                ? 'text-primary font-bold border-b-2 border-primary pb-1'
                : 'text-on-surface-variant font-medium hover:text-primary transition-colors duration-300'
            }`}
          >
            My Journeys
          </Link>
        </div>

        {/* Right Section */}
        <div className="hidden md:flex items-center gap-4">
          <Link
            to="/broadcast"
            className="flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-full font-label-caps hover:bg-primary-fixed-dim transition-colors"
          >
            Broadcast Route
          </Link>

          {/* User Menu Area */}
          <div className="flex items-center gap-3 ml-3">
            <Link to="/profile" className="w-10 h-10 rounded-full bg-surface-variant border border-outline-variant flex items-center justify-center text-primary font-title-md hover:bg-surface-bright transition-colors">
              {user ? getInitials(user.fullName) : 'U'}
            </Link>
            <button
              onClick={logout}
              className="text-on-surface-variant hover:text-error transition-colors p-2"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {/* Mobile menu (Placeholder) */}
        <button className="md:hidden text-primary p-2">
          <Menu size={24} />
        </button>
      </div>
    </nav>
  );
}
