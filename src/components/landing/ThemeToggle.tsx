import { useThemeContext } from '../../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
  const { theme, setTheme } = useThemeContext();

  const toggle = () => {
    if (theme === 'dark') {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setTheme('light');
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setTheme('dark');
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      className="flex items-center justify-center size-9 p-2 rounded-full bg-slate-950/5 hover:bg-slate-950/10 dark:bg-white/10 dark:hover:bg-white/20 transition-colors duration-200"
      aria-label="Toggle theme"
    >
      {theme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
    </button>
  );
}
