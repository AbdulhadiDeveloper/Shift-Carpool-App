import api from '../lib/axios';
import { RegisterFormData } from '../lib/schemas';
import { LoginResponse, RegisterResponse } from '../types';

export const authService = {
  login: async (email: string, password: string): Promise<LoginResponse> => {
    const { data } = await api.post('/api/auth/login', { email, password });
    return data;
  },

  register: async (userData: RegisterFormData): Promise<RegisterResponse> => {
    const { data } = await api.post('/api/auth/register', userData);
    return data;
  },
};
