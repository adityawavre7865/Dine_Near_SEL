import { useState, useEffect, useCallback } from 'react';
import { UtensilsCrossed, TrendingUp, Award } from 'lucide-react';
import Navbar from '../components/Navbar';
import HotelCard from '../components/HotelCard';
import SearchBar from '../components/SearchBar';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';

const HERO_IMAGES = [
  'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1400&auto=format&fit=crop',
];

export default function Home() {
  const { isAuthenticated } = useAuth();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [heroIdx, setHeroIdx] = useState(0);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favIds, setFavIds] = useState([]);

  // Hero image rotation
  useEffect(() => {
    const t = setInterval(() => setHeroIdx((i) => (i + 1) % HERO_IMAGES.length), 5000);
    return () => clearInterval(t);
  }, []);

  // Load favorites
  useEffect(() => {
    if (isAuthenticated) {
      API.get('/users/preferences').then((r) => {
        setFavIds(r.data.preferences?.favoriteHotels?.map((h) => h._id || h) || []);
      }).catch(() => {});
    }
  }, [isAuthenticated]);

  const fetchHotels = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit: 9, ...filter };
      if (search) params.search = search;
      const { data } = await API.get('/hotels', { params });
      setHotels(data.hotels || []);
      setTotalPages(data.pages || 1);
    } catch {
      setHotels([]);
    } finally {
      setLoading(false);
    }
  }, [search, filter, page]);

  useEffect(() => { fetchHotels(); }, [fetchHotels]);

  const handleSearch = (q) => { setSearch(q); setPage(1); };
  const handleFilter = (f) => { setFilter(f); setPage(1); };

  return (
    <div className="min-h-screen bg-surface-secondary dark:bg-slate-900">
      <Navbar />

      {/* Hero Section */}
      <section className="relative h-[420px] overflow-hidden">
        {HERO_IMAGES.map((img, i) => (
          <div
            key={img}
            className={`absolute inset-0 transition-opacity duration-1000 ${i === heroIdx ? 'opacity-100' : 'opacity-0'}`}
          >
            <img src={img} alt="food" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
          </div>
        ))}
        <div className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-10 h-10 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg">
              <UtensilsCrossed size={20} className="text-white" />
            </div>
            <span className="text-white font-bold text-2xl tracking-tight">DineNear</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 leading-tight">
            Discover Today's Food<br />
            <span className="text-primary-400">Around You</span>
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-xl">
            Browse nearby restaurants, explore menus, and find exactly what you're craving.
          </p>
          {/* Hero search */}
          <div className="w-full max-w-xl">
            <SearchBar onSearch={handleSearch} onFilter={handleFilter} placeholder="Search restaurants or dishes..." />
          </div>
          {/* Hero stats */}
          <div className="flex items-center gap-6 mt-8">
            {[
              { icon: UtensilsCrossed, label: '50+ Restaurants' },
              { icon: TrendingUp, label: '500+ Menu Items' },
              { icon: Award, label: 'Top Rated Picks' },
            ].map(({ icon: Icon, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-white/80 text-sm">
                <Icon size={15} className="text-primary-400" />
                {label}
              </div>
            ))}
          </div>
        </div>
        {/* Dot indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
          {HERO_IMAGES.map((_, i) => (
            <button key={i} onClick={() => setHeroIdx(i)}
              className={`w-2 h-2 rounded-full transition-all ${i === heroIdx ? 'bg-primary-400 w-5' : 'bg-white/50'}`} />
          ))}
        </div>
      </section>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Section header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Nearby Restaurants</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mt-0.5">Discover the best food around you</p>
          </div>
          <div className="hidden md:block w-80">
            <SearchBar onSearch={handleSearch} onFilter={handleFilter} />
          </div>
        </div>

        {/* Hotels grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array(6).fill(0).map((_, i) => (
              <div key={i} className="card overflow-hidden animate-pulse">
                <div className="h-48 bg-slate-200 dark:bg-slate-700" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-full" />
                  <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : hotels.length === 0 ? (
          <div className="text-center py-20">
            <UtensilsCrossed size={48} className="text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-slate-500 dark:text-slate-400">No restaurants found</h3>
            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {hotels.map((hotel) => (
              <HotelCard key={hotel._id} hotel={hotel} isFavorite={favIds.includes(hotel._id)} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
            >← Prev</button>
            <span className="px-4 py-2 text-sm text-slate-600 dark:text-slate-400">
              Page {page} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="btn-secondary px-4 py-2 text-sm disabled:opacity-40"
            >Next →</button>
          </div>
        )}
      </main>
    </div>
  );
}
