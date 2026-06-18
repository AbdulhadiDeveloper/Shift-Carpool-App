import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Flag, Clock, Radio, Loader2 } from 'lucide-react';
import { broadcastSchema, BroadcastFormData } from '../../lib/schemas';
import SeatCounter from '../ui/SeatCounter';
import { rideService } from '../../services/rideService';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export default function BroadcastForm() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<BroadcastFormData>({
    resolver: zodResolver(broadcastSchema),
    defaultValues: {
      totalSeats: 3,
    },
  });

  const onSubmit = async (data: BroadcastFormData) => {
    try {
      await rideService.createRide(data);
      toast.success('Route broadcasted successfully!');
      navigate('/journeys');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Failed to broadcast route');
    }
  };

  const inputClass = "bg-transparent border-none border-b border-outline-variant text-primary w-full py-3 font-body-lg focus:outline-none focus:border-primary transition-colors placeholder:text-outline-variant";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-6 w-full">
      {/* Origin */}
      <div>
        <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase tracking-widest">
          Starting Point
        </label>
        <div className="flex items-center gap-3">
          <MapPin size={24} className="text-on-surface-variant shrink-0" />
          <input
            {...register('origin')}
            type="text"
            placeholder="e.g. 123 Main St, San Francisco"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>
        {errors.origin && <p className="text-error text-body-sm mt-1">{errors.origin.message}</p>}
      </div>

      {/* Connector */}
      <div className="pl-4 py-1 border-l-2 border-dashed border-surface-variant ml-3 h-2"></div>

      {/* Destination */}
      <div>
        <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase tracking-widest">
          Drop-Off Destination
        </label>
        <div className="flex items-center gap-3">
          <Flag size={24} className="text-on-surface-variant shrink-0" />
          <input
            {...register('destination')}
            type="text"
            placeholder="e.g. Google HQ, Mountain View"
            className={inputClass}
            disabled={isSubmitting}
          />
        </div>
        {errors.destination && <p className="text-error text-body-sm mt-1">{errors.destination.message}</p>}
      </div>

      {/* Departure Window */}
      <div className="mt-4">
        <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase tracking-widest">
          Departure Window
        </label>
        <div className="flex items-center gap-3">
          <Clock size={24} className="text-on-surface-variant shrink-0" />
          <input
            {...register('departureTime')}
            type="datetime-local"
            className={`${inputClass} [color-scheme:dark]`}
            disabled={isSubmitting}
          />
        </div>
        {errors.departureTime && <p className="text-error text-body-sm mt-1">{errors.departureTime.message}</p>}
      </div>

      {/* Passenger Seats */}
      <div className="mt-4 mb-6">
        <label className="block font-label-caps text-label-caps text-outline mb-1 uppercase tracking-widest">
          Passenger Seats
        </label>
        <Controller
          name="totalSeats"
          control={control}
          render={({ field }) => (
            <SeatCounter
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />
        {errors.totalSeats && <p className="text-error text-body-sm mt-1">{errors.totalSeats.message}</p>}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full bg-primary text-on-primary font-body-lg text-body-lg font-bold py-4 px-6 rounded-lg hover:bg-primary-fixed transition-colors flex justify-center items-center gap-3 disabled:opacity-50 mt-3"
      >
        {isSubmitting ? (
          <Loader2 className="animate-spin" size={24} />
        ) : (
          <Radio size={24} />
        )}
        ((•)) Broadcast Route Live
      </button>
    </form>
  );
}
