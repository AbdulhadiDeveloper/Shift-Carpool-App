import { Link } from 'react-router-dom';
import RegisterForm from '../components/forms/RegisterForm';

export default function RegisterPage() {
  return (
    <div className="bg-background text-on-background min-h-screen flex flex-col font-body-lg selection:bg-primary selection:text-on-primary relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-20 bg-[radial-gradient(ellipse_at_top_right,var(--tw-gradient-stops))] from-surface-bright via-background to-background"></div>
      
      <div className="grow flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-surface-container-low border border-surface-bright rounded-xl p-8 shadow-2xl relative z-10 flex flex-col">
          
          <div>
            <span className="font-title-md text-title-md font-bold tracking-tight text-primary mb-2 block">Shift Carpool</span>
            <h1 className="font-headline-lg text-headline-lg text-primary mb-2">Create an Account</h1>
            <p className="font-body-sm text-body-sm text-on-surface-variant">Join our community of verified commuters.</p>
          </div>

          <RegisterForm />

          <div className="mt-6 text-center">
            <Link to="/login" className="text-primary hover:text-primary-fixed-dim font-medium transition-colors border-b border-primary/30 hover:border-primary pb-1">
              Already a member? Sign In
            </Link>
          </div>
          
        </div>
      </div>
    </div>
  );
}
