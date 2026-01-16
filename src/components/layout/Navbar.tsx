import { Bell, Search, Menu, User } from 'lucide-react';
import { Input } from '../ui/input';
import { useState } from 'react';
import { cn } from '../../utils/cn';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const [notifications] = useState(3); // Mock notification count

  return (
    <div className="h-16 bg-gradient-to-r from-white via-gray-50 to-white border-b border-gray-200/50 shadow-sm sticky top-0 z-30 backdrop-blur-sm bg-white/95">
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 hover:text-gray-900"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* Search Bar */}
        <div className="flex-1 max-w-md mx-4">
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            <Input
              type="search"
              placeholder="Search customers, packages..."
              className="pl-10 w-full border-gray-300 focus:border-blue-500 focus:ring-blue-500/20 transition-all shadow-sm hover:shadow-md"
            />
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {/* Notifications */}
          <button className="relative p-2 rounded-lg hover:bg-gray-100 transition-all hover:scale-105 text-gray-600 hover:text-gray-900 group">
            <Bell className="h-5 w-5 transition-transform group-hover:scale-110" />
            {notifications > 0 && (
              <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            )}
          </button>

          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
              <User className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900">Admin</p>
              <p className="text-xs text-gray-500">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
