import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFoundPage() {
  return (
    <div className="flex-grow flex items-center justify-center p-4">
      <div className="bento-card text-center max-w-md w-full py-8 relative overflow-hidden">
        {/* Background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary rounded-full mix-blend-screen filter blur-[100px] opacity-10 pointer-events-none"></div>
        
        <h1 className="font-display text-[80px] text-primary tracking-tight leading-none mb-3">404</h1>
        <h2 className="font-headline-lg text-headline-lg text-primary mb-4">Lost Your Way?</h2>
        <p className="font-body-lg text-body-lg text-on-surface-variant mb-8">
          The route you are looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/explore" 
          className="inline-flex items-center justify-center gap-3 bg-primary text-on-primary py-3 px-6 rounded-full font-title-md text-title-md hover:bg-primary-fixed-dim transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
