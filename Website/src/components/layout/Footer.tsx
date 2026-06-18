import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full mt-auto border-t border-outline-variant/30">
      <div className="flex flex-col md:flex-row justify-between items-center py-8 px-5 md:px-8 max-w-7xl mx-auto w-full">
        {/* Brand/Copyright */}
        <div className="text-label-caps text-primary mb-4 md:mb-0">
          © 2024 Shift Carpool. The Art of the Shared Journey.
        </div>
        
        {/* Links */}
        <nav className="flex flex-wrap justify-center gap-4">
          <Link to="#" className="text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200">
            Privacy Policy
          </Link>
          <Link to="#" className="text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200">
            Terms of Service
          </Link>
          <Link to="#" className="text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200">
            Help Center
          </Link>
          <Link to="#" className="text-on-surface-variant font-body-sm hover:text-primary transition-colors duration-200">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  );
}
