import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Users,
  Package,
  CreditCard,
  Router,
  Receipt,
  LogOut,
  X,
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
      "w-64 bg-gradient-to-b from-blue-600 via-blue-700 to-indigo-800 h-screen flex flex-col shadow-2xl",
      "lg:static lg:translate-x-0 lg:z-auto fixed top-0 left-0 z-50 transition-transform duration-300 ease-in-out",
      isOpen === false ? "-translate-x-full lg:translate-x-0" : "translate-x-0"
    )}>
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden absolute top-4 right-4 p-2 rounded-lg text-white hover:bg-white/20 transition-colors"
        >
          <X className="h-5 w-5" />
        </button>
      )}

      {/* Logo/Brand */}
      <div className="p-6 border-b border-white/10">
        <h1 className="text-2xl font-bold text-white tracking-tight bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
          ISP Billing
        </h1>
        <p className="text-xs text-blue-200 mt-1">Management System</p>
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
                'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative group',
                isActive
                  ? 'bg-white/20 text-white shadow-lg shadow-white/10 scale-105'
                  : 'text-blue-100 hover:bg-white/10 hover:text-white hover:scale-102'
              )}
            >
              <div className={cn(
                "absolute inset-0 rounded-xl transition-opacity",
                isActive ? "bg-gradient-to-r from-white/30 to-transparent" : "bg-gradient-to-r from-white/0 to-transparent group-hover:from-white/10"
              )} />
              <Icon className={cn(
                "h-5 w-5 relative z-10 transition-transform",
                isActive && "scale-110"
              )} />
              <span className="relative z-10">{item.label}</span>
              {isActive && (
                <div className="absolute right-2 w-1.5 h-1.5 bg-white rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="p-4 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-white bg-red-500/20 hover:bg-red-500/30 border border-red-400/30 transition-all duration-200 hover:scale-105 hover:shadow-lg"
        >
          <LogOut className="h-5 w-5" />
          <span>Logout</span>
        </button>
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
