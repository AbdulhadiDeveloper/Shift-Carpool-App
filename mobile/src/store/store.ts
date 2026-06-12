import { configureStore, createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

// --- Types ---
export interface Ride {
  _id: string;
  driverId: string;
  driverName: string;
  driverPhone?: string; // Newly added
  origin: string;
  destination: string;
  departureTime: string; // The backend now returns Date, but it gets serialized as an ISO string
  estimatedDuration: string;
  availableSeats: number;
  totalSeats: number;
  passengers: string[];
  status: 'active' | 'completed' | 'cancelled';
}

interface AuthState {
  token: string | null;
  user: { _id: string; fullName: string; email: string; phone?: string } | null;
  loading: boolean;
  error: string | null;
}

interface RidesState {
  activeRidesList: Ride[];
  myRidesList: Ride[];
  loading: boolean;
  error: string | null;
}

// --- Auth Async Thunks ---
export const restoreSession = createAsyncThunk('auth/restore', async (_, { rejectWithValue }) => {
  try {
    const token = await SecureStore.getItemAsync('token');
    const userStr = await SecureStore.getItemAsync('user');
    if (token && userStr) {
      return { token, user: JSON.parse(userStr) };
    }
    return rejectWithValue('No session');
  } catch {
    return rejectWithValue('No session');
  }
});

export const loginUser = createAsyncThunk('auth/login', async (credentials: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/login`, credentials);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify({ _id: response.data._id, fullName: response.data.fullName, email: response.data.email, phone: response.data.phone }));
    return response.data; 
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Login failed');
  }
});

export const registerUser = createAsyncThunk('auth/register', async (userData: any, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/auth/register`, userData);
    await SecureStore.setItemAsync('token', response.data.token);
    await SecureStore.setItemAsync('user', JSON.stringify({ _id: response.data._id, fullName: response.data.fullName, email: response.data.email, phone: response.data.phone }));
    return response.data; 
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || err.message || 'Registration failed');
  }
});

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('user');
});

// --- Rides Async Thunks ---
export const fetchRides = createAsyncThunk('rides/fetch', async () => {
  const response = await axios.get(`${API_URL}/rides`); 
  return response.data;
});

export const fetchMyRides = createAsyncThunk('rides/fetchMy', async () => {
  const response = await axios.get(`${API_URL}/rides/my`);
  return response.data;
});

export const joinRide = createAsyncThunk('rides/join', async (rideId: string) => {
  // We no longer need to pass userId in the body, it comes from the JWT
  const response = await axios.patch(`${API_URL}/rides/${rideId}/join`); 
  return response.data;
});

export const leaveRide = createAsyncThunk('rides/leave', async (rideId: string, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_URL}/rides/${rideId}/leave`); 
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to leave ride');
  }
});

export const cancelRideRoute = createAsyncThunk('rides/cancel', async (rideId: string, { rejectWithValue }) => {
  try {
    const response = await axios.patch(`${API_URL}/rides/${rideId}/cancel`); 
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to cancel ride');
  }
});

export const updateRideRoute = createAsyncThunk('rides/update', async (data: { id: string, destination: string, departureTime: string, totalSeats: number }, { rejectWithValue }) => {
  try {
    const { id, ...updateData } = data;
    const response = await axios.patch(`${API_URL}/rides/${id}`, updateData); 
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to update ride');
  }
});

export const createRide = createAsyncThunk('rides/create', async (rideData: Partial<Ride>, { rejectWithValue }) => {
  try {
    const response = await axios.post(`${API_URL}/rides`, rideData);
    return response.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.error || 'Failed to create ride');
  }
});

// --- Slices ---
const authSlice = createSlice({
  name: 'auth',
  initialState: { token: null, user: null, loading: false, error: null } as AuthState,
  reducers: { 
    logout: (state) => { state.token = null; state.user = null; } 
  },
  extraReducers: (builder) => {
    builder
      .addCase(restoreSession.fulfilled, (state, action) => {
        state.token = action.payload.token;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.token = null;
        state.user = null;
      })
      .addCase(loginUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(loginUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.token = action.payload.token; 
        state.user = { _id: action.payload._id, fullName: action.payload.fullName, email: action.payload.email, phone: action.payload.phone };
      })
      .addCase(loginUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; })
      .addCase(registerUser.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(registerUser.fulfilled, (state, action) => { 
        state.loading = false; 
        state.token = action.payload.token; 
        state.user = { _id: action.payload._id, fullName: action.payload.fullName, email: action.payload.email, phone: action.payload.phone };
      })
      .addCase(registerUser.rejected, (state, action) => { state.loading = false; state.error = action.payload as string; });
  }
});

const uiSlice = createSlice({
  name: 'ui', 
  initialState: { isDriverView: false },
  reducers: { 
    toggleMode: (state) => { state.isDriverView = !state.isDriverView; } 
  }
});

const ridesSlice = createSlice({
  name: 'rides', 
  initialState: { activeRidesList: [], myRidesList: [], loading: false, error: null } as RidesState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRides.pending, (state) => { state.loading = true; })
      .addCase(fetchRides.fulfilled, (state, action) => { state.loading = false; state.activeRidesList = action.payload; })
      .addCase(fetchMyRides.pending, (state) => { state.loading = true; })
      .addCase(fetchMyRides.fulfilled, (state, action) => { state.loading = false; state.myRidesList = action.payload; })
      .addCase(joinRide.fulfilled, (state, action) => {
        const index = state.activeRidesList.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.activeRidesList[index] = action.payload;
        
        // Also update myRidesList if the user joined it
        const myIndex = state.myRidesList.findIndex((r) => r._id === action.payload._id);
        if (myIndex !== -1) {
          state.myRidesList[myIndex] = action.payload;
        } else {
          // If we joined, it should probably be in myRidesList now
          state.myRidesList.push(action.payload);
        }
      })
      .addCase(leaveRide.fulfilled, (state, action) => {
        const index = state.activeRidesList.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.activeRidesList[index] = action.payload;
        state.myRidesList = state.myRidesList.filter(r => r._id !== action.payload._id);
      })
      .addCase(cancelRideRoute.fulfilled, (state, action) => {
        state.activeRidesList = state.activeRidesList.filter(r => r._id !== action.payload._id);
        const myIndex = state.myRidesList.findIndex((r) => r._id === action.payload._id);
        if (myIndex !== -1) state.myRidesList[myIndex] = action.payload;
      })
      .addCase(updateRideRoute.fulfilled, (state, action) => {
        const index = state.activeRidesList.findIndex((r) => r._id === action.payload._id);
        if (index !== -1) state.activeRidesList[index] = action.payload;
        const myIndex = state.myRidesList.findIndex((r) => r._id === action.payload._id);
        if (myIndex !== -1) state.myRidesList[myIndex] = action.payload;
      })
      .addCase(createRide.fulfilled, (state, action) => {
        state.activeRidesList.unshift(action.payload);
        state.myRidesList.unshift(action.payload);
      });
  }
});

export const { logout } = authSlice.actions;
export const { toggleMode } = uiSlice.actions;

export const store = configureStore({
  reducer: { 
    auth: authSlice.reducer, 
    ui: uiSlice.reducer, 
    rides: ridesSlice.reducer 
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// --- Axios Interceptor ---
// Set up Axios to automatically attach the JWT token to every request
axios.interceptors.request.use((config) => {
  const state = store.getState() as RootState;
  const token = state.auth.token;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {  return Promise.reject(error);
});