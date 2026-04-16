import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Heart, UtensilsCrossed, Building2, Menu } from 'lucide-react';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import HotelCard from '../components/HotelCard';
import MenuItemCard from '../components/MenuItemCard';
import { useAuth } from '../context/AuthContext';
import API from '../api/axios';
import toast from 'react-hot-toast';

export default function UserDashboard() {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    API.get('/users/preferences')
      .then((r) => setPrefs(r.data.preferences))
      .catch(() => toast.error('Failed to load preferences'))
      .finally(() => setLoading(false));
  }, []);

  const stats = [
    { label: 'Favorite Restaurants', value: prefs?.favoriteHotels?.length || 0, icon: Building2, color: 'text-primary-500 bg-primary-50 dark:bg-primary-900/20' },
    { label: 'Saved Dishes', value: prefs?.favoriteItems?.length || 0, icon: Heart, color: 'text-red-500 bg-red-50 dark:bg-red-900/20' },
    { label: 'Cuisines Preferred', value: prefs?.preferredCuisines?.length || 0, icon: UtensilsCrossed, color: 'text-blue-500 bg-blue-50 dark:bg-blue-900/20' },
  ];

  const TABS = ['overview', 'favorites', 'preferences'];

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />
      <div className="flex">
        <Sidebar mobileOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <main className="flex-1 min-w-0 p-6 lg:p-8">
          {/* Mobile sidebar toggle */}
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden mb-4 btn-secondary text-sm gap-2">
            <Menu size={16} /> Menu
          </button>

          {/* Header */}
          <div className="mb-6">
            <h1 className="page-header">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">Here's what's happening with your account</p>
          </div>

          {/* Tabs */}
          <div className="flex gap-1 mb-6 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl w-fit">
            {TABS.map((tab) => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activeTab === tab ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-200'}`}>
                {tab}
              </button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div>
              {/* Stats */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color }) => (
                  <div key={label} className="card p-5 flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
                      <Icon size={22} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-slate-800 dark:text-white">{loading ? '–' : value}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{label}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick actions */}
              <div className="card p-6 mb-6">
                <h2 className="section-title mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link to="/" className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-primary-50 dark:hover:bg-primary-900/10 transition-all group">
                    <div className="w-10 h-10 bg-primary-100 dark:bg-primary-900/30 rounded-xl flex items-center justify-center">
                      <UtensilsCrossed size={18} className="text-primary-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white text-sm group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">Browse Restaurants</p>
                      <p className="text-xs text-slate-400">Find food near you</p>
                    </div>
                  </Link>
                  <button onClick={() => setActiveTab('favorites')}
                    className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-red-300 dark:hover:border-red-700 hover:bg-red-50 dark:hover:bg-red-900/10 transition-all group text-left">
                    <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center">
                      <Heart size={18} className="text-red-500" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800 dark:text-white text-sm group-hover:text-red-500 transition-colors">View Favorites</p>
                      <p className="text-xs text-slate-400">{prefs?.favoriteHotels?.length || 0} saved restaurants</p>
                    </div>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'favorites' && (
            <div>
              <h2 className="section-title mb-4">Favorite Restaurants</h2>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : prefs?.favoriteHotels?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {prefs.favoriteHotels.map((hotel) => (
                    <HotelCard key={hotel._id} hotel={hotel} isFavorite={true} />
                  ))}
                </div>
              ) : (
                <div className="card p-10 text-center">
                  <Heart size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No favorite restaurants yet</p>
                  <Link to="/" className="btn-primary text-sm mt-4 inline-flex">Browse Restaurants</Link>
                </div>
              )}

              <h2 className="section-title mb-4 mt-8">Favorite Dishes</h2>
              {loading ? (
                <p className="text-slate-400 text-sm">Loading...</p>
              ) : prefs?.favoriteItems?.length > 0 ? (
                <div className="space-y-3">
                  {prefs.favoriteItems.map((item) => (
                    <MenuItemCard key={item._id} item={item} isFavorite={true} />
                  ))}
                </div>
              ) : (
                <div className="card p-10 text-center">
                  <UtensilsCrossed size={40} className="text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                  <p className="text-slate-500 dark:text-slate-400">No favorite dishes yet</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'preferences' && (
            <div className="card p-6 max-w-xl">
              <h2 className="section-title mb-4">Dietary Preferences</h2>
              {prefs?.preferredCuisines?.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {prefs.preferredCuisines.map((c) => (
                    <span key={c} className="badge badge-blue capitalize">{c}</span>
                  ))}
                </div>
              ) : (
                <p className="text-slate-400 text-sm">No cuisine preferences saved.</p>
              )}
              {prefs?.dietaryPreferences?.length > 0 && (
                <>
                  <h2 className="section-title mt-6 mb-3">Diet Type</h2>
                  <div className="flex flex-wrap gap-2">
                    {prefs.dietaryPreferences.map((d) => (
                      <span key={d} className="badge badge-green capitalize">{d}</span>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
