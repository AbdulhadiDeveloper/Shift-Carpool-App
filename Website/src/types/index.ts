export interface User {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  token?: string;
}

export interface Ride {
  _id: string;
  driverId: string;
  driverName: string;
  driverPhone: string;
  origin: string;
  destination: string;
  departureTime: string;
  estimatedDuration: string;
  totalSeats: number;
  availableSeats: number;
  passengers: string[];
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
}

export interface LoginResponse {
  _id: string;
  fullName: string;
  email: string;
  phone: string;
  token: string;
}

export interface RegisterResponse extends LoginResponse {}
