import { useThemeContext } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

interface ThemeToggleProps {
  /** Optional class for the button. Use for navbar-specific styling (e.g. light nav vs dark nav). */
  className?: string;
}

export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, toggleTheme } = useThemeContext();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      className={
        className ??
        'flex items-center justify-center size-9 p-2 rounded-lg bg-slate-950/5 hover:bg-slate-950/10 dark:bg-white/10 dark:hover:bg-white/20 text-slate-700 dark:text-gray-200 transition-colors duration-200'
      }
      aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
