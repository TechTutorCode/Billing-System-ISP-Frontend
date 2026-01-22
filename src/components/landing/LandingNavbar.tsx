import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';

export function LandingNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navLink =
    'px-3 py-2 text-sm font-medium transition-colors';
  const navLinkActive = 'text-saas-primary';
  const navLinkInactive =
    'text-gray-700 hover:text-saas-primary dark:text-white dark:hover:text-saas-primary';

  return (
    <nav className="bg-white/95 dark:bg-saas-black/90 backdrop-blur-sm sticky top-0 z-50 border-b border-gray-200 dark:border-saas-darkGray">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold bg-gradient-to-r from-saas-primary to-saas-primaryDark bg-clip-text text-transparent">
                ISP Billing
              </span>
            </Link>
          </div>

          <div className="hidden md:block">
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className={`${navLink} ${isActive('/') ? navLinkActive : navLinkInactive}`}
              >
                Home
              </Link>
              <a href="#features" className={`${navLink} ${navLinkInactive}`}>
                Features
              </a>
              <a href="#pricing" className={`${navLink} ${navLinkInactive}`}>
                Pricing
              </a>
              <a href="#faq" className={`${navLink} ${navLinkInactive}`}>
                FAQ
              </a>
              <a href="#contact" className={`${navLink} ${navLinkInactive}`}>
                Contact
              </a>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <ThemeToggle
              className="flex items-center justify-center size-9 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
            />
            <Link
              to="/dashboard/login"
              className="btn-primary inline-flex items-center justify-center"
            >
              Get Started
            </Link>
          </div>

          <div className="md:hidden flex items-center gap-2">
            <ThemeToggle
              className="flex items-center justify-center size-9 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-white/10 dark:hover:bg-white/20 text-gray-700 dark:text-gray-200 transition-colors"
            />
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 dark:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-gray-50 dark:bg-saas-darkGray border-t border-gray-200 dark:border-saas-darkGray">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/" className={`block px-3 py-2 text-sm font-medium ${isActive('/') ? 'text-saas-primary' : 'text-gray-700 dark:text-white hover:text-saas-primary'}`} onClick={() => setIsOpen(false)}>
              Home
            </Link>
            <a href="#features" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-saas-primary" onClick={() => setIsOpen(false)}>
              Features
            </a>
            <a href="#pricing" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-saas-primary" onClick={() => setIsOpen(false)}>
              Pricing
            </a>
            <a href="#faq" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-saas-primary" onClick={() => setIsOpen(false)}>
              FAQ
            </a>
            <a href="#contact" className="block px-3 py-2 text-sm font-medium text-gray-700 dark:text-white hover:text-saas-primary" onClick={() => setIsOpen(false)}>
              Contact
            </a>
            <div className="mt-4 px-3 py-2">
              <Link to="/dashboard/login" className="btn-primary block text-center w-full" onClick={() => setIsOpen(false)}>
                Get Started
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
