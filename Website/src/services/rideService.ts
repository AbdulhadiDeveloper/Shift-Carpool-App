import api from '../lib/axios';
import { Ride } from '../types';
import { BroadcastFormData } from '../lib/schemas';

export const rideService = {
  getRides: async (): Promise<Ride[]> => {
    const { data } = await api.get('/api/rides');
    return data;
  },

  getMyRides: async (): Promise<Ride[]> => {
    const { data } = await api.get('/api/rides/my');
    return data;
  },

  createRide: async (rideData: BroadcastFormData): Promise<Ride> => {
    const { data } = await api.post('/api/rides', rideData);
    return data;
  },

  joinRide: async (id: string): Promise<Ride> => {
    const { data } = await api.patch(`/api/rides/${id}/join`);
    return data;
  },

  leaveRide: async (id: string): Promise<Ride> => {
    const { data } = await api.patch(`/api/rides/${id}/leave`);
    return data;
  },

  updateRide: async (id: string, updateData: Partial<Ride>): Promise<Ride> => {
    const { data } = await api.patch(`/api/rides/${id}`, updateData);
    return data;
  },

  cancelRide: async (id: string): Promise<Ride> => {
    const { data } = await api.patch(`/api/rides/${id}/cancel`);
    return data;
  },
};
