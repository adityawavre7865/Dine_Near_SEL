import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { UtensilsCrossed, Sun, Moon, Menu, X, ChevronDown, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { isDark, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
    setDropdownOpen(false);
  };

  const dashboardPath = user?.role === 'admin' ? '/admin' : user?.role === 'owner' ? '/owner' : '/dashboard';

  return (
    <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-sm group-hover:bg-primary-600 transition-colors">
              <UtensilsCrossed size={18} className="text-white" />
            </div>
            <span className="text-xl font-bold text-slate-800 dark:text-white">
              Dine<span className="text-primary-500">Near</span>
            </span>
          </Link>

          {/* Desktop nav links */}
          <div className="hidden md:flex items-center gap-1">
            <Link to="/" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
              Explore
            </Link>
            {!isAuthenticated && (
              <>
                <Link to="/login" className="px-3 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-primary-500 dark:hover:text-primary-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                  Sign In
                </Link>
                <Link to="/signup" className="btn-primary text-sm ml-2">
                  Get Started
                </Link>
              </>
            )}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2">
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* User dropdown */}
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen((p) => !p)}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                >
                  <div className="w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-semibold text-sm">
                    {user.name?.charAt(0).toUpperCase()}
                  </div>
                  <span className="hidden md:block text-sm font-medium text-slate-700 dark:text-slate-200 max-w-[100px] truncate">
                    {user.name}
                  </span>
                  <ChevronDown size={14} className={`text-slate-400 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
                </button>

                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 card shadow-card-hover py-1 animate-in fade-in slide-in-from-top-2 duration-150">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-700 mb-1">
                      <p className="text-xs text-slate-400 dark:text-slate-500">Signed in as</p>
                      <p className="text-sm font-medium text-slate-700 dark:text-slate-200 truncate">{user.email}</p>
                    </div>
                    <Link
                      to={dashboardPath}
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 hover:text-primary-500 transition-colors"
                    >
                      <LayoutDashboard size={15} /> Dashboard
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                    >
                      <LogOut size={15} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : null}

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="md:hidden p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
            >
              {menuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 bg-white dark:bg-slate-900">
          <Link to="/" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
            Explore
          </Link>
          {!isAuthenticated ? (
            <>
              <Link to="/login" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Sign In
              </Link>
              <Link to="/signup" onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium bg-primary-500 text-white hover:bg-primary-600 transition-all text-center mt-2">
                Get Started
              </Link>
            </>
          ) : (
            <>
              <Link to={dashboardPath} onClick={() => setMenuOpen(false)} className="block px-3 py-2 rounded-xl text-sm font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                Sign Out
              </button>
            </>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
