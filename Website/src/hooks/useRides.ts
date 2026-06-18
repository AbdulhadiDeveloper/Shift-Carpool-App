import { useState, useCallback } from 'react';
import { Ride } from '../types';
import { rideService } from '../services/rideService';
import { toast } from 'sonner';

export function useRides() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [myRides, setMyRides] = useState<Ride[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRides = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rideService.getRides();
      setRides(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch rides');
      toast.error('Failed to load available rides');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchMyRides = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await rideService.getMyRides();
      setMyRides(data);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to fetch your journeys');
      toast.error('Failed to load your journeys');
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    rides,
    myRides,
    isLoading,
    error,
    fetchRides,
    fetchMyRides,
  };
}
