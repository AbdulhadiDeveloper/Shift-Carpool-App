import { createContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { User } from '../types';
import { authService } from '../services/authService';
import { LoginFormData, RegisterFormData } from '../lib/schemas';
import { STORAGE_KEYS } from '../lib/axios';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Restore session on mount
    const storedToken = localStorage.getItem(STORAGE_KEYS.TOKEN);
    const storedUser = localStorage.getItem(STORAGE_KEYS.USER);

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to parse stored user', e);
      }
    }
    setIsLoading(false);
  }, []);

  const handleAuthSuccess = (response: any) => {
    const { token: newToken, ...userData } = response;
    setToken(newToken);
    setUser(userData);
    localStorage.setItem(STORAGE_KEYS.TOKEN, newToken);
    localStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(userData));
  };

  const login = async (data: LoginFormData) => {
    try {
      const response = await authService.login(data.email, data.password);
      handleAuthSuccess(response);
      toast.success('Welcome back!');
      navigate('/explore');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Login failed';
      toast.error(msg);
      throw error;
    }
  };

  const register = async (data: RegisterFormData) => {
    try {
      const response = await authService.register(data);
      handleAuthSuccess(response);
      toast.success('Account created successfully!');
      navigate('/explore');
    } catch (error: any) {
      const msg = error.response?.data?.error || 'Registration failed';
      toast.error(msg);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem(STORAGE_KEYS.TOKEN);
    localStorage.removeItem(STORAGE_KEYS.USER);
    toast.success('Signed out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        isLoading,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
