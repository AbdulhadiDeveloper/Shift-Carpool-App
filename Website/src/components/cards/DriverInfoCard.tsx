import { Star } from 'lucide-react';
import Avatar from '../ui/Avatar';

interface DriverInfoCardProps {
  name: string;
  phone: string;
  className?: string;
}

export default function DriverInfoCard({ name, phone, className = '' }: DriverInfoCardProps) {
  return (
    <div className={`flex flex-col md:flex-row items-center justify-between p-6 bg-surface-container-lowest border border-outline-variant rounded-lg gap-4 ${className}`}>
      <div className="flex items-center gap-4 w-full">
        <Avatar name={name} size="lg" className="border-2 border-primary" />
        <div className="flex flex-col">
          <span className="font-label-caps text-label-caps text-outline uppercase tracking-widest mb-1">
            Your Driver
          </span>
          <p className="font-title-md text-title-md text-primary font-medium">{name}</p>
          <div className="flex items-center gap-1 mt-1">
            <Star size={16} className="text-primary fill-primary" />
            <span className="font-label-caps text-label-caps text-primary tracking-wider">4.9</span>
            <span className="text-outline-variant">•</span>
            <span className="font-body-sm text-body-sm text-on-surface-variant">{phone}</span>
          </div>
        </div>
      </div>
      
      {/* Vehicle Placeholder */}
      <div className="flex flex-col items-end w-full md:w-auto">
        <div className="text-right mb-2">
          <p className="font-body-sm text-body-sm text-on-surface">Tesla Model 3</p>
          <p className="font-body-sm text-body-sm text-on-surface-variant">White</p>
        </div>
        <div className="bg-surface-container px-3 py-1 rounded text-on-surface font-body-sm text-body-sm border border-outline-variant font-mono tracking-wider">
          XYZ-1234
        </div>
      </div>
    </div>
  );
}
