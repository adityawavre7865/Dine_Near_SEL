import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard, Heart, Settings, UtensilsCrossed,
  Building2, PlusCircle, Users, BarChart3, ShieldCheck, X
} from 'lucide-react';

const userLinks = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Overview' },
  { to: '/dashboard/favorites', icon: Heart, label: 'Favorites' },
  { to: '/dashboard/preferences', icon: Settings, label: 'Preferences' },
];

const ownerLinks = [
  { to: '/owner', icon: LayoutDashboard, label: 'Overview' },
  { to: '/owner/hotels', icon: Building2, label: 'My Hotels' },
  { to: '/owner/add-hotel', icon: PlusCircle, label: 'Add Hotel' },
  { to: '/owner/menu', icon: UtensilsCrossed, label: 'Menu Manager' },
];

const adminLinks = [
  { to: '/admin', icon: BarChart3, label: 'Dashboard' },
  { to: '/admin/users', icon: Users, label: 'Users' },
  { to: '/admin/hotels', icon: Building2, label: 'Hotels' },
];

const Sidebar = ({ mobileOpen, onClose }) => {
  const { user } = useAuth();

  const links =
    user?.role === 'admin' ? adminLinks :
    user?.role === 'owner' ? ownerLinks :
    userLinks;

  const roleLabel =
    user?.role === 'admin' ? 'Admin Panel' :
    user?.role === 'owner' ? 'Owner Dashboard' :
    'My Dashboard';

  const roleIcon =
    user?.role === 'admin' ? <ShieldCheck size={16} className="text-primary-500" /> :
    user?.role === 'owner' ? <Building2 size={16} className="text-primary-500" /> :
    <LayoutDashboard size={16} className="text-primary-500" />;

  const sidebarContent = (
    <div className="flex flex-col h-full p-4">
      {/* Role label */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          {roleIcon}
          <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            {roleLabel}
          </span>
        </div>
        {onClose && (
          <button onClick={onClose} className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 lg:hidden">
            <X size={18} />
          </button>
        )}
      </div>

      {/* User avatar */}
      <div className="flex items-center gap-3 mb-6 px-3 py-3 bg-slate-50 dark:bg-slate-700/50 rounded-xl">
        <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center text-primary-600 dark:text-primary-400 font-bold">
          {user?.name?.charAt(0).toUpperCase()}
        </div>
        <div className="overflow-hidden">
          <p className="text-sm font-semibold text-slate-700 dark:text-slate-200 truncate">{user?.name}</p>
          <p className="text-xs text-slate-400 dark:text-slate-500 truncate">{user?.email}</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="space-y-1">
        {links.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to.split('/').length <= 2}
            onClick={onClose}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={17} />
            {label}
          </NavLink>
        ))}
      </nav>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex flex-col w-60 min-h-[calc(100vh-4rem)] bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700">
        {sidebarContent}
      </aside>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <aside className="fixed left-0 top-0 z-50 w-64 h-full bg-white dark:bg-slate-800 shadow-xl lg:hidden">
            {sidebarContent}
          </aside>
        </>
      )}
    </>
  );
};

export default Sidebar;
