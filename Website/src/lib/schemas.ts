import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type LoginFormData = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

export const broadcastSchema = z.object({
  origin: z.string().min(2, 'Starting point is required'),
  destination: z.string().min(2, 'Destination is required'),
  departureTime: z.string().min(1, 'Departure time is required'),
  totalSeats: z.number().min(1).max(4),
});

export type BroadcastFormData = z.infer<typeof broadcastSchema>;
