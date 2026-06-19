import { MessageSquare, Phone } from 'lucide-react';
import Avatar from '../ui/Avatar';
import RatingBadge from '../ui/RatingBadge';

interface PassengerCardProps {
  name: string;
  pickupLocation: string;
  phone?: string;
}

export default function PassengerCard({ name, pickupLocation, phone }: PassengerCardProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-lg bg-surface-container-low border border-surface-variant gap-4">
      <div className="flex items-center gap-4">
        <Avatar name={name} size="md" className="border-2 border-surface-container-high" />
        <div>
          <p className="font-body-lg text-body-lg text-primary">{name}</p>
          <div className="flex items-center gap-2 mt-1">
            <RatingBadge rating={5.0} />
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant truncate max-w-[150px]">
              {pickupLocation}
            </span>
          </div>
        </div>
      </div>
      
      <div className="flex gap-3">
        {phone ? (
          <>
            <a 
              href={`https://wa.me/${phone.replace(/\D/g, '')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-outline-variant transition-colors"
            >
              <MessageSquare size={18} />
            </a>
            <a 
              href={`tel:${phone}`}
              className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-outline-variant transition-colors"
            >
              <Phone size={18} />
            </a>
          </>
        ) : (
          <>
            <button className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-outline-variant transition-colors opacity-50 cursor-not-allowed">
              <MessageSquare size={18} />
            </button>
            <button className="w-10 h-10 rounded-full bg-surface-variant text-on-surface flex items-center justify-center hover:bg-outline-variant transition-colors opacity-50 cursor-not-allowed">
              <Phone size={18} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}
