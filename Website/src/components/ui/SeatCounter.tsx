import { Minus, Plus, Armchair } from 'lucide-react';

interface SeatCounterProps {
  value: number;
  onChange: (val: number) => void;
}

export default function SeatCounter({ value, onChange }: SeatCounterProps) {
  const handleDecrement = () => {
    if (value > 1) onChange(value - 1);
  };

  const handleIncrement = () => {
    if (value < 4) onChange(value + 1);
  };

  return (
    <div className="flex items-center justify-between w-full p-4 bg-surface border border-outline-variant rounded-lg">
      <div className="flex items-center gap-3">
        <Armchair className="text-on-surface-variant" size={24} />
        <span className="font-body-lg text-body-lg text-on-surface">Available Seats</span>
      </div>
      
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={handleDecrement}
          disabled={value <= 1}
          className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary disabled:opacity-50 hover:bg-surface-highest transition-colors"
        >
          <Minus size={16} />
        </button>
        
        <span className="font-title-md text-title-md text-primary w-4 text-center">
          {value}
        </span>
        
        <button
          type="button"
          onClick={handleIncrement}
          disabled={value >= 4}
          className="w-8 h-8 rounded-full bg-surface-container-high border border-outline-variant flex items-center justify-center text-primary disabled:opacity-50 hover:bg-surface-highest transition-colors"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  );
}
