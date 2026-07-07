import { Loader2, LogOut, Menu, Moon, Sun } from 'lucide-react';
import React, { useContext, useState } from 'react';
import authServices from '../../services/authServices';
import { useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import toast from 'react-hot-toast';

// Map routes to readable page titles
const PAGE_TITLES = {
  '/dashboard':  'Dashboard',
  '/charts':     'Analytics',
  '/expenses':   'Expenses',
  '/income':     'Income',
  '/categories': 'Categories',
  '/settings':   'Settings',
};

const Header = ({ onMenuClick }) => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, setUser } = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  if (!user) return null;

  const pageTitle = PAGE_TITLES[location.pathname] ?? 'NexSpend';

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      const data = await authServices.logout();
      if (data.success) {
        setUser(null);
        navigate('/login');
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <header className="bg-background border-b border-border w-full px-4 md:px-6 py-4 sticky top-0 z-20">
      <div className="flex justify-between items-center w-full gap-3">

        {/* Left: hamburger (mobile) + page title */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger – only on mobile */}
          <button
            onClick={onMenuClick}
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer shrink-0"
            aria-label="Open menu"
          >
            <Menu size={18} />
          </button>

          <h1 className="text-lg md:text-xl font-semibold text-foreground truncate">
            {pageTitle}
          </h1>
        </div>

        {/* Right: greeting + theme toggle + logout */}
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {/* User profile picture / avatar */}
          <div className="flex items-center gap-2">
            {user?.profilePhoto ? (
              <img
                src={user.profilePhoto}
                alt={user.name}
                onClick={() => navigate("/settings")}
                className="w-8 h-8 rounded-full object-cover cursor-pointer hover:scale-110 duration-500 border border-border shadow-xs"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm border border-blue-500/20 select-none">
                {user?.name?.charAt(0).toUpperCase()}
              </div>
            )}
            {/* Greeting – hidden on very small screens */}
            <span className="hidden sm:block text-sm text-muted-foreground whitespace-nowrap">
              Hello,{' '}
              <span className="font-semibold text-foreground">{user?.name}</span>
            </span>
          </div>

          {/* Theme toggle */}
          <button
            id="theme-toggle-header"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className="flex items-center justify-center w-9 h-9 rounded-xl border border-border bg-muted hover:bg-accent text-muted-foreground hover:text-foreground transition-all duration-200 cursor-pointer"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {/* Logout */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 text-sm cursor-pointer text-muted-foreground hover:text-red-500 transition-colors duration-200"
          >
            {isLoading
              ? <Loader2 size={16} className="animate-spin" />
              : <><LogOut size={16} /><span className="hidden sm:inline">Logout</span></>
            }
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;