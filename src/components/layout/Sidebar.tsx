import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Router,
  Receipt,
  LogOut,
  X,
  Sparkles,
  Wifi,
  UserCheck,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { authApi } from '../../api/auth';
import { useToast } from '../ui/toast';
import { cn } from '../../utils/cn';

const menuItems = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard },
  { path: '/customers', label: 'Customers', icon: Users },
  { path: '/packages', label: 'Packages', icon: Package },
  { path: '/subscriptions', label: 'Subscriptions', icon: CreditCard },
  { path: '/payments', label: 'Payments', icon: Receipt },
  { path: '/routers', label: 'Routers', icon: Router },
  { path: '/hotspot/packages', label: 'Hotspot Packages', icon: Wifi },
  { path: '/hotspot/users', label: 'Hotspot Users', icon: UserCheck },
];

const externalLinks = [
  { path: '/hotspot/login', label: 'Hotspot Portal', icon: Wifi, external: true },
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar = ({ isOpen = true, onClose }: SidebarProps) => {
  const location = useLocation();
  const { clearTokens } = useAuthStore();
  const { addToast } = useToast();

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = '';
    }
  }, [isOpen]);

  const handleLogout = async () => {
    try {
      await authApi.logout(true);
      clearTokens();
      window.location.href = '/login';
    } catch (error) {
      addToast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to logout',
      });
    }
  };

  const sidebarContent = (
    <div className={cn(
      "w-72 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 h-screen flex flex-col shadow-2xl relative overflow-hidden",
      "lg:static lg:translate-x-0 lg:z-auto fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
      isOpen === false ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
    )}>
      {/* Animated Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 2px 2px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-600/20 to-pink-600/20" />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full">
        {/* Mobile Close Button */}
        {onClose && (
          <button
            onClick={onClose}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-white hover:bg-white/20 transition-colors z-20"
          >
            <X className="h-5 w-5" />
          </button>
        )}

        {/* Logo/Brand */}
        <div className="p-6 border-b border-white/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg shadow-lg">
              <Sparkles className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white tracking-tight">
                ISP Billing
              </h1>
              <p className="text-xs text-purple-200 mt-0.5">Management System</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group',
                  isActive
                    ? 'bg-gradient-to-r from-blue-500/90 to-purple-500/90 text-white shadow-lg shadow-purple-500/50 scale-[1.02]'
                    : 'text-purple-100 hover:bg-white/10 hover:text-white hover:scale-[1.01]'
                )}
              >
                {/* Active Indicator */}
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-white rounded-r-full" />
                )}
                
                {/* Icon Container */}
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  isActive 
                    ? "bg-white/20 shadow-md" 
                    : "bg-white/5 group-hover:bg-white/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300",
                    isActive && "scale-110"
                  )} />
                </div>
                
                <span className="relative z-10 flex-1">{item.label}</span>
                
                {/* Hover Effect */}
                {!isActive && (
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                )}
              </Link>
            );
          })}

          {/* Divider */}
          <div className="my-4 border-t border-white/10" />

          {/* External Links */}
          {externalLinks.map((item) => {
            const Icon = item.icon;
            return (
              <a
                key={item.path}
                href={item.path}
                target="_blank"
                rel="noopener noreferrer"
                onClick={onClose}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 relative group',
                  'text-purple-100 hover:bg-white/10 hover:text-white hover:scale-[1.01]'
                )}
              >
                {/* Icon Container */}
                <div className={cn(
                  "p-2 rounded-lg transition-all duration-300",
                  "bg-white/5 group-hover:bg-white/10"
                )}>
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-300"
                  )} />
                </div>
                
                <span className="relative z-10 flex-1">{item.label}</span>
                
                {/* External Link Indicator */}
                <svg
                  className="h-4 w-4 opacity-50 group-hover:opacity-100 transition-opacity"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
                
                {/* Hover Effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </a>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t border-white/10 backdrop-blur-sm">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-gradient-to-r from-red-500/20 to-red-600/20 hover:from-red-500/30 hover:to-red-600/30 border border-red-400/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg hover:shadow-red-500/20 group"
          >
            <div className="p-1.5 rounded-lg bg-red-500/20 group-hover:bg-red-500/30 transition-colors">
              <LogOut className="h-4 w-4" />
            </div>
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && onClose && (
        <div
          className="lg:hidden fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity"
          onClick={onClose}
        />
      )}
      {sidebarContent}
    </>
  );
};
