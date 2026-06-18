import { Link } from 'react-router-dom';
import LoginForm from '../components/forms/LoginForm';

export default function LoginPage() {
  return (
    <div className="bg-background text-on-surface min-h-screen flex flex-col font-body-lg relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 opacity-20 pointer-events-none bg-[radial-gradient(ellipse_at_center,var(--tw-gradient-stops))] from-surface-bright via-background to-background"></div>
      
      <div className="grow flex items-center justify-center p-4">
        <div className="bg-surface-container-low border border-outline-variant/30 rounded-xl p-8 w-full max-w-md relative z-10 shadow-2xl flex flex-col gap-6 backdrop-blur-sm">
          
          <div className="text-center mb-4">
            <h1 className="font-display text-display text-primary tracking-tight mb-2">Shift Carpool</h1>
            <p className="font-body-lg text-body-lg text-on-surface-variant">Sign in to continue your journey</p>
          </div>

          <LoginForm />

          <div className="mt-4 text-center">
            <Link to="/register" className="text-primary hover:text-primary-fixed-dim font-medium transition-colors border-b border-primary/30 hover:border-primary pb-1">
              Don't have an account? Create an Account
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
