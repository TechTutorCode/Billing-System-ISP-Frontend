import { Menu, User } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { ispsApi } from '../../api/isps';
import { ThemeToggle } from '../ui/ThemeToggle';

interface NavbarProps {
  onMenuClick?: () => void;
}

export const Navbar = ({ onMenuClick }: NavbarProps) => {
  const { data: ispProfile, isLoading } = useQuery({
    queryKey: ['isp-profile'],
    queryFn: () => ispsApi.getProfile(),
    retry: 1,
  });

  return (
    <div className="h-16 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 shadow-sm sticky top-0 z-30">
      <div className="flex items-center justify-between px-4 sm:px-6 h-full">
        {/* Mobile Menu Button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
        >
          <Menu className="h-6 w-6" />
        </button>

        {/* ISP Name */}
        <div className="flex-1 lg:ml-0 ml-4">
          {isLoading ? (
            <div className="h-6 w-48 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-blue-200 dark:ring-blue-900">
                <span className="text-white text-base font-bold">
                  {ispProfile?.name?.charAt(0).toUpperCase() || 'I'}
                </span>
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 dark:text-white tracking-tight">
                  {ispProfile?.name || 'ISP Name'}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Internet Service Provider</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          <ThemeToggle
            className="flex items-center justify-center size-9 p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 transition-colors"
          />
          {/* User Avatar */}
          <div className="flex items-center gap-3 pl-2 border-l border-gray-200 dark:border-gray-700">
            <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer group">
              <User className="h-5 w-5 text-white group-hover:scale-110 transition-transform" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-gray-900 dark:text-white">Admin</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">Online</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
